import { murmur3_32 } from "./hash";
import type { VNodeSnapshot } from "./types";

interface VNode {
  hash: number;
  nodeId: string;
}

// A real consistent-hash ring with virtual nodes. Each physical node owns
// `vnodesPerNode` points on a 2^32 ring; a key maps to the first vnode
// clockwise from its hash. Adding/removing a node only reassigns the keys in
// that node's arcs — the whole point of consistent hashing.
export class HashRing {
  private vnodesPerNode: number;
  private hashFn: (s: string) => number;
  private ring: VNode[] = []; // kept sorted by hash
  private ids = new Set<string>();

  constructor(opts: { vnodesPerNode?: number; hash?: (s: string) => number } = {}) {
    this.vnodesPerNode = opts.vnodesPerNode ?? 64;
    // MurmurHash3 gives far better avalanche than FNV-1a on near-identical vnode
    // keys ("node-0#0", "node-0#1", ...), which is what keeps the ring balanced.
    this.hashFn = opts.hash ?? murmur3_32;
  }

  get size(): number {
    return this.ids.size;
  }
  get vnodeTotal(): number {
    return this.ring.length;
  }
  hasNode(id: string): boolean {
    return this.ids.has(id);
  }

  private insertSorted(v: VNode): void {
    let lo = 0;
    let hi = this.ring.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.ring[mid].hash < v.hash) lo = mid + 1;
      else hi = mid;
    }
    this.ring.splice(lo, 0, v);
  }

  addNode(id: string): void {
    if (this.ids.has(id)) return;
    this.ids.add(id);
    for (let i = 0; i < this.vnodesPerNode; i++) {
      this.insertSorted({ hash: this.hashFn(`${id}#${i}`), nodeId: id });
    }
  }

  removeNode(id: string): void {
    if (!this.ids.has(id)) return;
    this.ids.delete(id);
    this.ring = this.ring.filter((v) => v.nodeId !== id);
  }

  setVNodesPerNode(n: number): void {
    this.vnodesPerNode = n;
    const ids = [...this.ids];
    this.ring = [];
    this.ids.clear();
    for (const id of ids) this.addNode(id);
  }

  // First vnode clockwise from the key's hash (wrapping around the ring).
  getNode(key: string): string | null {
    if (this.ring.length === 0) return null;
    const h = this.hashFn(key);
    let lo = 0;
    let hi = this.ring.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.ring[mid].hash < h) lo = mid + 1;
      else hi = mid;
    }
    return this.ring[lo % this.ring.length].nodeId;
  }

  vnodes(): VNodeSnapshot[] {
    return this.ring.map((v) => ({ angle: v.hash / 0x100000000, nodeId: v.nodeId }));
  }
}
