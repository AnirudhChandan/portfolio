import { fnv1a } from "./hash";
import { HashRing } from "./hashring";
import { mulberry32 } from "@/lib/pydb"; // reuse the shared seedable PRNG
import type {
  DistributionStat,
  RebalanceResult,
  RingNodeSnapshot,
  RingSnapshot,
  Strategy,
} from "./types";

const COLORS = [
  "#2dd4bf",
  "#a855f7",
  "#38bdf8",
  "#f59e0b",
  "#f472b6",
  "#34d399",
  "#fb7185",
  "#c084fc",
];

export interface ShardingEngineOptions {
  seed?: number;
  vnodesPerNode?: number;
  keyCount?: number;
  initialNodes?: number;
}

// Facade the UI talks to. Owns the ring, a fixed seeded key corpus, and computes
// real rebalance diffs (before vs after placement) when a node is added/removed.
export class ShardingEngine {
  private ring: HashRing;
  private keys: string[];
  private strategy: Strategy = "consistent";
  private vnodesPerNode: number;
  private nodeOrder: string[] = [];
  private meta = new Map<string, { label: string; color: string }>();
  private seq = 0;
  private version = 0;
  private reshuffles = 0;
  private readonly seed: number;
  private lastRebalance: RebalanceResult | null = null;
  private listeners = new Set<() => void>();
  private cached: RingSnapshot | null = null;

  constructor(opts: ShardingEngineOptions = {}) {
    this.vnodesPerNode = opts.vnodesPerNode ?? 50;
    this.seed = opts.seed ?? 20240501;
    const keyCount = opts.keyCount ?? 600;
    this.ring = new HashRing({ vnodesPerNode: this.vnodesPerNode });
    this.keys = this.generateKeys(keyCount);
    for (let i = 0; i < (opts.initialNodes ?? 3); i++) this.addNodeInternal();
  }

  private generateKeys(count: number): string[] {
    const prng = mulberry32(this.seed + this.reshuffles * 7919);
    return Array.from({ length: count }, (_, i) => `key:${i}:${Math.floor(prng() * 0xffffffff)}`);
  }

  private addNodeInternal(): string {
    const id = `node-${this.seq}`;
    const label = `SRV-${this.seq}`;
    this.seq++;
    this.ring.addNode(id);
    this.nodeOrder.push(id);
    this.meta.set(id, { label, color: COLORS[(this.nodeOrder.length - 1) % COLORS.length] });
    return id;
  }

  // Where a key lands under the *current* strategy.
  placement(key: string): string | null {
    if (this.strategy === "consistent") return this.ring.getNode(key);
    if (this.nodeOrder.length === 0) return null;
    return this.nodeOrder[fnv1a(key) % this.nodeOrder.length];
  }

  private snapshotPlacements(): Map<string, string> {
    const m = new Map<string, string>();
    for (const k of this.keys) {
      const n = this.placement(k);
      if (n) m.set(k, n);
    }
    return m;
  }

  private recordRebalance(
    action: "add" | "remove",
    changedNodeId: string,
    before: Map<string, string>,
  ): RebalanceResult {
    const after = this.snapshotPlacements();
    let moved = 0;
    for (const k of this.keys) if (before.get(k) !== after.get(k)) moved++;
    const total = this.keys.length || 1;
    const n = Math.max(1, this.nodeOrder.length);
    const idealFraction = action === "add" ? 1 / n : 1 / (n + 1);
    const result: RebalanceResult = {
      action,
      changedNodeId,
      moved,
      total,
      movedFraction: moved / total,
      idealFraction,
    };
    this.lastRebalance = result;
    return result;
  }

  addNode(): RingNodeSnapshot {
    const before = this.snapshotPlacements();
    const id = this.addNodeInternal();
    this.recordRebalance("add", id, before);
    this.bump();
    return this.nodeSnapshot(id);
  }

  removeNode(id: string): RebalanceResult | null {
    if (!this.meta.has(id)) return null;
    const before = this.snapshotPlacements();
    this.ring.removeNode(id);
    this.nodeOrder = this.nodeOrder.filter((x) => x !== id);
    this.meta.delete(id);
    const result = this.recordRebalance("remove", id, before);
    this.bump();
    return result;
  }

  removeLastNode(): RebalanceResult | null {
    const id = this.nodeOrder[this.nodeOrder.length - 1];
    return id ? this.removeNode(id) : null;
  }

  setStrategy(strategy: Strategy): void {
    if (strategy === this.strategy) return;
    this.strategy = strategy;
    this.lastRebalance = null;
    this.bump();
  }

  setVNodesPerNode(n: number): void {
    this.vnodesPerNode = n;
    this.ring.setVNodesPerNode(n);
    this.lastRebalance = null;
    this.bump();
  }

  reshuffleKeys(): void {
    this.reshuffles++;
    this.keys = this.generateKeys(this.keys.length);
    this.lastRebalance = null;
    this.bump();
  }

  // --- test/introspection helpers (pure) ---
  nodeIds(): string[] {
    return [...this.nodeOrder];
  }
  get strategyMode(): Strategy {
    return this.strategy;
  }
  debugPlacements(): Map<string, string> {
    return this.snapshotPlacements();
  }

  private computeStats(): DistributionStat[] {
    const counts = new Map<string, number>();
    for (const id of this.nodeOrder) counts.set(id, 0);
    for (const k of this.keys) {
      const n = this.placement(k);
      if (n) counts.set(n, (counts.get(n) ?? 0) + 1);
    }
    const total = this.keys.length || 1;
    return this.nodeOrder.map((id) => {
      const m = this.meta.get(id)!;
      const c = counts.get(id) ?? 0;
      return { nodeId: id, label: m.label, color: m.color, keyCount: c, share: c / total };
    });
  }

  private nodeSnapshot(id: string): RingNodeSnapshot {
    const m = this.meta.get(id)!;
    return {
      id,
      label: m.label,
      color: m.color,
      vnodeCount: this.strategy === "consistent" ? this.vnodesPerNode : 0,
    };
  }

  private bump(): void {
    this.version++;
    this.cached = null;
    for (const l of this.listeners) l();
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): RingSnapshot => {
    if (this.cached) return this.cached;
    this.cached = {
      version: this.version,
      strategy: this.strategy,
      vnodesPerNode: this.vnodesPerNode,
      keyCount: this.keys.length,
      nodes: this.nodeOrder.map((id) => this.nodeSnapshot(id)),
      vnodes: this.strategy === "consistent" ? this.ring.vnodes() : [],
      stats: this.computeStats(),
      lastRebalance: this.lastRebalance,
    };
    return this.cached;
  };
}
