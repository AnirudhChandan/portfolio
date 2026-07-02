import { BTree } from "./btree";
import { Pager } from "./pager";
import { mulberry32 } from "./prng";
import { Wal } from "./wal";
import {
  FANOUT,
  LEAF_CAP,
  type EngineSnapshot,
  type NodeId,
  type RowValue,
  type SplitEvent,
} from "./types";

const USERS = [
  "ada",
  "linus",
  "grace",
  "dennis",
  "ken",
  "barbara",
  "guido",
  "margaret",
  "alan",
  "edsger",
  "donald",
  "leslie",
];
const DOMAINS = ["db.io", "pydb.dev", "corp.net", "mail.com"];

export interface StorageEngineOptions {
  seed?: number;
}

// The facade the UI talks to. Holds the pager/wal/btree, a seeded PRNG for
// reproducible demo data, a logical clock, and a cached immutable snapshot that
// only gets a new identity after a mutation (the useSyncExternalStore contract).
export class StorageEngine {
  private pager!: Pager;
  private wal!: Wal;
  private btree!: BTree;
  private prng!: () => number;
  private ticks = 0;
  private txId = 0;
  private version = 0;
  private lastSplit: SplitEvent | null = null;
  private activePageId: NodeId | null = null;
  private lastOp: EngineSnapshot["lastOp"] = { kind: "none", key: null };
  private listeners = new Set<() => void>();
  private cached: EngineSnapshot | null = null;
  private readonly seed: number;

  constructor(opts: StorageEngineOptions = {}) {
    this.seed = opts.seed ?? 1337;
    this.init();
  }

  private init(): void {
    this.pager = new Pager();
    this.wal = new Wal();
    this.prng = mulberry32(this.seed);
    this.ticks = 0;
    this.txId = 0;
    this.btree = new BTree(this.pager, this.wal, () => this.ticks++);
  }

  private bump(): void {
    this.version++;
    this.cached = null;
    for (const l of this.listeners) l();
  }

  insert(key: number, value: RowValue): SplitEvent | null {
    this.txId++;
    const res = this.btree.insert(key, value, this.txId);
    this.wal.append({
      txId: this.txId,
      op: "COMMIT",
      pageId: null,
      key: null,
      detail: `tx${this.txId} committed`,
      ts: this.ticks++,
    });
    this.lastSplit = res.split;
    this.activePageId = res.activePageId;
    this.lastOp = { kind: res.updated ? "update" : "insert", key };
    this.bump();
    return res.split;
  }

  insertRandom(): { key: number } {
    const key = 1 + Math.floor(this.prng() * 899);
    const user = USERS[Math.floor(this.prng() * USERS.length)];
    const domain = DOMAINS[Math.floor(this.prng() * DOMAINS.length)];
    this.insert(key, { user, email: `${user}@${domain}` });
    return { key };
  }

  delete(key: number): boolean {
    this.txId++;
    const res = this.btree.delete(key, this.txId);
    if (res.deleted) {
      this.wal.append({
        txId: this.txId,
        op: "COMMIT",
        pageId: null,
        key: null,
        detail: `tx${this.txId} committed`,
        ts: this.ticks++,
      });
    }
    this.lastSplit = null;
    this.activePageId = res.activePageId;
    this.lastOp = { kind: "delete", key };
    this.bump();
    return res.deleted;
  }

  // Deletes a pseudo-random currently-present key (for the UI button).
  deleteRandom(): number | null {
    const keys = this.btree.inorderKeys();
    if (keys.length === 0) return null;
    const key = keys[Math.floor(this.prng() * keys.length)];
    this.delete(key);
    return key;
  }

  select(key: number): RowValue | null {
    return this.btree.search(key);
  }

  reset(): void {
    this.init();
    this.lastSplit = null;
    this.activePageId = null;
    this.lastOp = { kind: "reset", key: null };
    this.bump();
  }

  // Exposed for tests (pure, deterministic).
  keys(): number[] {
    return this.btree.inorderKeys();
  }
  leafDepths(): number[] {
    return this.btree.leafDepths();
  }
  get height(): number {
    return this.btree.height;
  }

  // --- useSyncExternalStore contract (stable, bound refs) ---
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): EngineSnapshot => {
    if (this.cached) return this.cached;
    const nodes = this.btree.snapshotNodes();
    const rowCount = nodes.reduce((s, n) => s + (n.isLeaf ? n.keys.length : 0), 0);
    this.cached = {
      version: this.version,
      order: FANOUT,
      leafCap: LEAF_CAP,
      height: this.btree.height,
      nodeCount: this.btree.nodeCount,
      rowCount,
      rootId: this.btree.rootId,
      nodes,
      pages: this.pager.snapshotPages(),
      wal: this.wal.snapshot(),
      lastSplit: this.lastSplit,
      activePageId: this.activePageId,
      lastOp: this.lastOp,
    };
    return this.cached;
  };
}
