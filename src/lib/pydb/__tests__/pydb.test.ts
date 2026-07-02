import { describe, expect, it } from "vitest";
import {
  CELL_SIZE,
  HEADER_SIZE,
  INTERNAL_CAP,
  LEAF_CAP,
  StorageEngine,
  mulberry32,
} from "@/lib/pydb";

function decodeU32LE(bytes: number[], off: number): number {
  return (
    (bytes[off] |
      (bytes[off + 1] << 8) |
      (bytes[off + 2] << 16) |
      (bytes[off + 3] << 24)) >>>
    0
  );
}

describe("PyDB B+Tree engine", () => {
  it("keeps keys in sorted order after many seeded inserts", () => {
    const db = new StorageEngine({ seed: 7 });
    for (let i = 0; i < 300; i++) db.insertRandom();
    const keys = db.keys();
    for (let i = 1; i < keys.length; i++) {
      expect(keys[i]).toBeGreaterThan(keys[i - 1]);
    }
  });

  it("keeps every leaf at the same depth (balance invariant)", () => {
    const db = new StorageEngine({ seed: 99 });
    for (let i = 0; i < 500; i++) db.insertRandom();
    const depths = new Set(db.leafDepths());
    expect(depths.size).toBe(1);
  });

  it("respects node capacity bounds and the child/key relationship", () => {
    const db = new StorageEngine({ seed: 42 });
    for (let i = 0; i < 400; i++) db.insertRandom();
    for (const n of db.getSnapshot().nodes) {
      if (n.isLeaf) {
        expect(n.keys.length).toBeLessThanOrEqual(LEAF_CAP);
      } else {
        expect(n.keys.length).toBeGreaterThanOrEqual(1);
        expect(n.keys.length).toBeLessThanOrEqual(INTERNAL_CAP);
        expect(n.childIds.length).toBe(n.keys.length + 1);
      }
    }
  });

  it("matches a Map oracle across a randomized insert/delete workload", () => {
    const db = new StorageEngine({ seed: 2024 });
    const oracle = new Map<number, string>();
    const rng = mulberry32(2024);
    for (let i = 0; i < 800; i++) {
      const key = 1 + Math.floor(rng() * 120);
      if (rng() < 0.7) {
        const user = `u${i}`;
        db.insert(key, { user, email: `${user}@db.io` });
        oracle.set(key, user);
      } else {
        db.delete(key);
        oracle.delete(key);
      }
    }
    for (let key = 0; key <= 121; key++) {
      const got = db.select(key);
      if (oracle.has(key)) {
        expect(got?.user).toBe(oracle.get(key));
      } else {
        expect(got).toBeNull();
      }
    }
  });

  it("grows tree height by exactly one on a root split", () => {
    const db = new StorageEngine({ seed: 1 });
    // Fill the root leaf to capacity (no split yet).
    for (let i = 0; i < LEAF_CAP; i++) db.insert((i + 1) * 10, { user: "x", email: "x@db.io" });
    expect(db.height).toBe(1);
    expect(db.getSnapshot().nodeCount).toBe(1);
    // One more key overflows the leaf → root split.
    const ev = db.insert((LEAF_CAP + 1) * 10, { user: "x", email: "x@db.io" });
    expect(ev).not.toBeNull();
    expect(ev?.kind).toBe("leaf");
    expect(ev?.causedHeightIncrease).toBe(true);
    expect(db.height).toBe(2);
    expect(db.getSnapshot().nodeCount).toBe(3); // new root + two leaves
  });

  it("writes a WAL where INSERT precedes COMMIT with strictly increasing LSNs", () => {
    const db = new StorageEngine({ seed: 5 });
    db.insert(50, { user: "ada", email: "ada@db.io" });
    const wal = db.getSnapshot().wal;
    const insertIdx = wal.findIndex((e) => e.op === "INSERT");
    const commitIdx = wal.findIndex((e) => e.op === "COMMIT");
    expect(insertIdx).toBeGreaterThanOrEqual(0);
    expect(commitIdx).toBeGreaterThan(insertIdx);
    for (let i = 1; i < wal.length; i++) {
      expect(wal[i].lsn).toBeGreaterThan(wal[i - 1].lsn);
    }
  });

  it("serializes the real key bytes into the leaf page (little-endian)", () => {
    const db = new StorageEngine({ seed: 3 });
    db.insert(0x1234, { user: "grace", email: "grace@db.io" });
    const snap = db.getSnapshot();
    const leaf = snap.pages.find((p) => p.role === "leaf" && p.usedBytes > HEADER_SIZE);
    expect(leaf).toBeDefined();
    // First cell begins right after the header; its first 4 bytes are the key LE.
    expect(decodeU32LE(leaf!.bytes, HEADER_SIZE)).toBe(0x1234);
    expect(leaf!.usedBytes).toBe(HEADER_SIZE + CELL_SIZE); // exactly one live cell
  });

  it("is fully deterministic for a given seed", () => {
    const a = new StorageEngine({ seed: 8675309 });
    const b = new StorageEngine({ seed: 8675309 });
    for (let i = 0; i < 120; i++) {
      a.insertRandom();
      b.insertRandom();
    }
    expect(a.keys()).toEqual(b.keys());
    expect(JSON.stringify(a.getSnapshot().pages)).toBe(JSON.stringify(b.getSnapshot().pages));
  });

  it("returns a stable snapshot reference until the next mutation", () => {
    const db = new StorageEngine({ seed: 11 });
    db.insertRandom();
    const s1 = db.getSnapshot();
    expect(db.getSnapshot()).toBe(s1); // cached identity (useSyncExternalStore contract)
    db.insertRandom();
    expect(db.getSnapshot()).not.toBe(s1);
  });
});
