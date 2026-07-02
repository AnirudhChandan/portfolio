// Consistent-hashing sharding — shared types.
export type Strategy = "consistent" | "modulo";

export interface RingNodeSnapshot {
  id: string;
  label: string;
  color: string;
  vnodeCount: number; // virtual nodes on the ring (0 in modulo mode)
}

export interface VNodeSnapshot {
  angle: number; // 0..1 position on the ring (hash normalized)
  nodeId: string;
}

export interface DistributionStat {
  nodeId: string;
  label: string;
  color: string;
  keyCount: number;
  share: number; // keyCount / total (0..1)
}

export interface RebalanceResult {
  action: "add" | "remove";
  changedNodeId: string;
  moved: number;
  total: number;
  movedFraction: number; // moved / total — the headline (~1/N for consistent)
  idealFraction: number; // what a perfectly-balanced scheme would move
}

export interface RingSnapshot {
  version: number;
  strategy: Strategy;
  vnodesPerNode: number;
  keyCount: number;
  nodes: RingNodeSnapshot[];
  vnodes: VNodeSnapshot[]; // for the ring plot (consistent mode)
  stats: DistributionStat[];
  lastRebalance: RebalanceResult | null;
}
