import type { NodeId, WalEntry, WalOp } from "./types";

// Append-only Write-Ahead Log. Every mutation is logged here BEFORE the page is
// changed (log-before-apply) and a COMMIT record is appended after — the same
// ordering a crash-recoverable engine relies on.
export class Wal {
  private entries: WalEntry[] = [];
  private nextLsn = 0;

  append(e: {
    txId: number;
    op: WalOp;
    pageId: NodeId | null;
    key: number | null;
    detail?: string | null;
    payloadHex?: string | null;
    ts: number;
  }): WalEntry {
    const entry: WalEntry = {
      lsn: this.nextLsn++,
      txId: e.txId,
      op: e.op,
      pageId: e.pageId,
      key: e.key,
      detail: e.detail ?? null,
      payloadHex: e.payloadHex ?? null,
      ts: e.ts,
    };
    this.entries.push(entry);
    return entry;
  }

  get length(): number {
    return this.entries.length;
  }

  // Tail of the log, newest last. Capped so the UI list stays bounded.
  snapshot(limit = 48): WalEntry[] {
    const start = Math.max(0, this.entries.length - limit);
    return this.entries.slice(start);
  }

  all(): WalEntry[] {
    return this.entries.slice();
  }

  clear(): void {
    this.entries = [];
    this.nextLsn = 0;
  }
}
