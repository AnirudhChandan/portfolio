import { cellPreviewHex, Pager } from "./pager";
import type { Wal } from "./wal";
import {
  INTERNAL_CAP,
  LEAF_CAP,
  type BTreeNodeSnapshot,
  type NodeId,
  type RowValue,
  type SplitEvent,
} from "./types";

interface LeafNode {
  id: NodeId;
  isLeaf: true;
  keys: number[];
  values: RowValue[];
  next: NodeId | null;
}
interface InternalNode {
  id: NodeId;
  isLeaf: false;
  keys: number[]; // separators; length === children.length - 1
  children: NodeId[];
}
type BNode = LeafNode | InternalNode;

interface Promote {
  key: number;
  rightId: NodeId;
}
interface SplitOutcome {
  promote: Promote;
  event: SplitEvent;
}
interface Descend {
  promote: Promote | null;
  updated: boolean;
  activePageId: NodeId;
  split: SplitEvent | null; // the highest split produced by this op, if any
}

export interface InsertResult {
  updated: boolean;
  activePageId: NodeId;
  split: SplitEvent | null;
}

// A real B+Tree: values live in the leaves (linked left→right), internal nodes
// hold separator keys only. Overflowing a node splits it; a root split grows the
// tree height. Every structural change is written through the Pager (bytes) and
// the Wal (log), so nothing about the visualization is faked.
export class BTree {
  private nodes = new Map<NodeId, BNode>();
  rootId: NodeId;

  constructor(
    private pager: Pager,
    private wal: Wal,
    private clock: () => number,
  ) {
    const id = this.pager.allocate("leaf");
    const root: LeafNode = { id, isLeaf: true, keys: [], values: [], next: null };
    this.nodes.set(id, root);
    this.pager.writeLeaf(id, [], [], null);
    this.rootId = id;
  }

  private node(id: NodeId): BNode {
    const n = this.nodes.get(id);
    if (!n) throw new Error(`btree: missing node ${id}`);
    return n;
  }

  // First index i where keys[i] >= key.
  private lowerBound(keys: number[], key: number): number {
    let lo = 0;
    let hi = keys.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (keys[mid] < key) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  // Child index to descend into for `key` (go right when key >= separator).
  private childIndex(n: InternalNode, key: number): number {
    let ci = 0;
    while (ci < n.keys.length && key >= n.keys[ci]) ci++;
    return ci;
  }

  search(key: number): RowValue | null {
    let n = this.node(this.rootId);
    while (!n.isLeaf) n = this.node(n.children[this.childIndex(n, key)]);
    const idx = this.lowerBound(n.keys, key);
    if (idx < n.keys.length && n.keys[idx] === key) return n.values[idx];
    return null;
  }

  insert(key: number, value: RowValue, txId: number): InsertResult {
    const res = this.insertInto(this.rootId, key, value, txId);
    const split = res.split;
    if (res.promote) {
      // Root split → allocate a brand new root, tree grows one level.
      const newRootId = this.pager.allocate("internal");
      const oldRoot = this.rootId;
      const newRoot: InternalNode = {
        id: newRootId,
        isLeaf: false,
        keys: [res.promote.key],
        children: [oldRoot, res.promote.rightId],
      };
      this.nodes.set(newRootId, newRoot);
      this.pager.writeInternal(newRootId, newRoot.keys, newRoot.children);
      this.wal.append({
        txId,
        op: "SPLIT",
        pageId: newRootId,
        key: res.promote.key,
        detail: `new root pg${newRootId} (promote ${res.promote.key})`,
        ts: this.clock(),
      });
      if (split) {
        split.parentId = newRootId;
        split.causedHeightIncrease = true;
      }
      this.rootId = newRootId;
    }
    return { updated: res.updated, activePageId: res.activePageId, split };
  }

  private insertInto(nodeId: NodeId, key: number, value: RowValue, txId: number): Descend {
    const n = this.node(nodeId);

    if (n.isLeaf) {
      const idx = this.lowerBound(n.keys, key);
      if (idx < n.keys.length && n.keys[idx] === key) {
        this.wal.append({
          txId,
          op: "UPDATE",
          pageId: n.id,
          key,
          payloadHex: cellPreviewHex(key, value),
          ts: this.clock(),
        });
        n.values[idx] = value;
        this.pager.writeLeaf(n.id, n.keys, n.values, n.next);
        return { promote: null, updated: true, activePageId: n.id, split: null };
      }
      // Log-before-apply: record the intent, then mutate the page.
      this.wal.append({
        txId,
        op: "INSERT",
        pageId: n.id,
        key,
        payloadHex: cellPreviewHex(key, value),
        ts: this.clock(),
      });
      n.keys.splice(idx, 0, key);
      n.values.splice(idx, 0, value);
      this.pager.writeLeaf(n.id, n.keys, n.values, n.next);
      if (n.keys.length > LEAF_CAP) {
        const { promote, event } = this.splitLeaf(n, txId);
        return { promote, updated: false, activePageId: n.id, split: event };
      }
      return { promote: null, updated: false, activePageId: n.id, split: null };
    }

    const child = this.insertInto(n.children[this.childIndex(n, key)], key, value, txId);
    if (!child.promote) {
      return {
        promote: null,
        updated: child.updated,
        activePageId: child.activePageId,
        split: child.split,
      };
    }
    // Absorb the promoted separator from the child.
    const pi = this.lowerBound(n.keys, child.promote.key);
    n.keys.splice(pi, 0, child.promote.key);
    n.children.splice(pi + 1, 0, child.promote.rightId);
    this.pager.writeInternal(n.id, n.keys, n.children);
    if (n.keys.length > INTERNAL_CAP) {
      const { promote, event } = this.splitInternal(n, txId);
      return { promote, updated: child.updated, activePageId: child.activePageId, split: event };
    }
    return {
      promote: null,
      updated: child.updated,
      activePageId: child.activePageId,
      split: child.split,
    };
  }

  private splitLeaf(leaf: LeafNode, txId: number): SplitOutcome {
    const mid = Math.ceil(leaf.keys.length / 2);
    const rightId = this.pager.allocate("leaf");
    const right: LeafNode = {
      id: rightId,
      isLeaf: true,
      keys: leaf.keys.splice(mid),
      values: leaf.values.splice(mid),
      next: leaf.next,
    };
    leaf.next = rightId;
    this.nodes.set(rightId, right);
    this.pager.writeLeaf(leaf.id, leaf.keys, leaf.values, leaf.next);
    this.pager.writeLeaf(rightId, right.keys, right.values, right.next);
    const promotedKey = right.keys[0]; // copy-up (B+Tree)
    this.wal.append({
      txId,
      op: "SPLIT",
      pageId: rightId,
      key: promotedKey,
      detail: `leaf pg${leaf.id} → pg${rightId} (copy ${promotedKey})`,
      ts: this.clock(),
    });
    return {
      promote: { key: promotedKey, rightId },
      event: {
        kind: "leaf",
        leftId: leaf.id,
        rightId,
        promotedKey,
        parentId: null,
        causedHeightIncrease: false,
      },
    };
  }

  private splitInternal(node: InternalNode, txId: number): SplitOutcome {
    const midIndex = Math.floor(node.keys.length / 2);
    const promotedKey = node.keys[midIndex];
    const rightId = this.pager.allocate("internal");
    const rightKeys = node.keys.splice(midIndex + 1);
    node.keys.splice(midIndex, 1); // remove the promoted separator (push-up)
    const rightChildren = node.children.splice(midIndex + 1);
    const right: InternalNode = {
      id: rightId,
      isLeaf: false,
      keys: rightKeys,
      children: rightChildren,
    };
    this.nodes.set(rightId, right);
    this.pager.writeInternal(node.id, node.keys, node.children);
    this.pager.writeInternal(rightId, right.keys, right.children);
    this.wal.append({
      txId,
      op: "SPLIT",
      pageId: rightId,
      key: promotedKey,
      detail: `internal pg${node.id} → pg${rightId} (promote ${promotedKey})`,
      ts: this.clock(),
    });
    return {
      promote: { key: promotedKey, rightId },
      event: {
        kind: "internal",
        leftId: node.id,
        rightId,
        promotedKey,
        parentId: null,
        causedHeightIncrease: false,
      },
    };
  }

  // v1 delete: remove the row from its leaf (real, and reflected in bytes + WAL).
  // Underflow borrow/merge is intentionally out of scope; leaves never move, so
  // "all leaves at equal depth" still holds.
  delete(key: number, txId: number): { deleted: boolean; activePageId: NodeId } {
    let n = this.node(this.rootId);
    while (!n.isLeaf) n = this.node(n.children[this.childIndex(n, key)]);
    const idx = this.lowerBound(n.keys, key);
    if (idx < n.keys.length && n.keys[idx] === key) {
      this.wal.append({ txId, op: "DELETE", pageId: n.id, key, ts: this.clock() });
      n.keys.splice(idx, 1);
      n.values.splice(idx, 1);
      this.pager.writeLeaf(n.id, n.keys, n.values, n.next);
      return { deleted: true, activePageId: n.id };
    }
    return { deleted: false, activePageId: n.id };
  }

  get height(): number {
    let h = 1;
    let n = this.node(this.rootId);
    while (!n.isLeaf) {
      h++;
      n = this.node(n.children[0]);
    }
    return h;
  }

  get nodeCount(): number {
    return this.nodes.size;
  }

  // Keys in ascending order by walking the linked leaf chain (proves ordering).
  inorderKeys(): number[] {
    let n = this.node(this.rootId);
    while (!n.isLeaf) n = this.node(n.children[0]);
    const out: number[] = [];
    let leaf: LeafNode | null = n;
    while (leaf) {
      out.push(...leaf.keys);
      leaf = leaf.next != null ? (this.node(leaf.next) as LeafNode) : null;
    }
    return out;
  }

  // Depth of every leaf (used to assert the balance invariant in tests).
  leafDepths(): number[] {
    const depths: number[] = [];
    const walk = (id: NodeId, depth: number) => {
      const n = this.node(id);
      if (n.isLeaf) depths.push(depth);
      else for (const c of n.children) walk(c, depth + 1);
    };
    walk(this.rootId, 0);
    return depths;
  }

  snapshotNodes(): BTreeNodeSnapshot[] {
    const out: BTreeNodeSnapshot[] = [];
    const queue: Array<{ id: NodeId; depth: number }> = [{ id: this.rootId, depth: 0 }];
    while (queue.length) {
      const { id, depth } = queue.shift()!;
      const n = this.node(id);
      if (n.isLeaf) {
        out.push({
          id,
          isLeaf: true,
          keys: [...n.keys],
          values: n.values.map((v) => ({ ...v })),
          childIds: [],
          depth,
        });
      } else {
        out.push({ id, isLeaf: false, keys: [...n.keys], values: [], childIds: [...n.children], depth });
        for (const c of n.children) queue.push({ id: c, depth: depth + 1 });
      }
    }
    return out;
  }
}
