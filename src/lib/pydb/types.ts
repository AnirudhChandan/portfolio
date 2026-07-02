// PyDB — shared types & constants for the in-browser storage engine.
// This is a real, working B+Tree over fixed-size pages with a write-ahead log.
// Sizes are scaled down from a production engine so the byte layout stays legible
// in the visualizer, but every byte, split and log entry below is real.

export const PAGE_SIZE = 256; // bytes per page (a real fixed-size page, sized for the eye)
export const HEADER_SIZE = 8; // page header bytes
export const CELL_SIZE = 32; // serialized bytes per leaf row cell
export const FANOUT = 4; // max children per internal node
export const LEAF_CAP = 3; // max rows per leaf before it splits (FANOUT - 1)
export const INTERNAL_CAP = FANOUT - 1; // max separator keys per internal node
export const NULL_PTR = 0xffffffff; // sentinel for "no page"

export type RowValue = { user: string; email: string };
export type Row = { key: number; value: RowValue };
export type NodeId = number; // a node is backed by the page of the same id
export type PageRole = "meta" | "leaf" | "internal" | "free";

export interface BTreeNodeSnapshot {
  id: NodeId;
  isLeaf: boolean;
  keys: number[];
  values: RowValue[]; // leaf only (empty for internal)
  childIds: NodeId[]; // internal only (empty for leaf)
  depth: number; // 0 = root
}

export type WalOp = "INSERT" | "UPDATE" | "DELETE" | "SPLIT" | "COMMIT";

export interface WalEntry {
  lsn: number; // log sequence number, strictly increasing
  txId: number;
  op: WalOp;
  pageId: NodeId | null;
  key: number | null;
  detail: string | null;
  payloadHex: string | null; // hex preview of the real serialized cell
  ts: number; // deterministic logical clock (never wall-clock)
}

export interface PageSnapshot {
  pageId: NodeId;
  role: PageRole;
  bytes: number[]; // exactly PAGE_SIZE entries (0..255) — the real serialized page
  usedBytes: number; // live bytes; the rest is zero padding
}

export interface SplitEvent {
  kind: "leaf" | "internal";
  leftId: NodeId;
  rightId: NodeId;
  promotedKey: number;
  parentId: NodeId | null;
  causedHeightIncrease: boolean;
}

export interface EngineSnapshot {
  version: number; // bumps on every mutation; snapshot identity helper
  order: number; // FANOUT
  leafCap: number;
  height: number;
  nodeCount: number;
  rowCount: number;
  rootId: NodeId;
  nodes: BTreeNodeSnapshot[]; // full tree (for the "Pager / RAM" view)
  pages: PageSnapshot[]; // physical pages (for the "Disk" view)
  wal: WalEntry[]; // append-only log (tail-capped for the UI)
  lastSplit: SplitEvent | null; // set when the last op caused a split
  activePageId: NodeId | null; // page touched by the most recent op
  lastOp: { kind: "insert" | "update" | "delete" | "reset" | "none"; key: number | null };
}
