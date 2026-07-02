import { describe, expect, it } from "vitest";
import { ShardingEngine, fnv1a } from "@/lib/sharding";

describe("consistent-hashing ring", () => {
  it("moves only ~1/N of keys when a node is added (minimal rebalancing)", () => {
    const eng = new ShardingEngine({ seed: 1, vnodesPerNode: 80, keyCount: 1000, initialNodes: 3 });
    eng.addNode(); // now 4 nodes
    const r = eng.getSnapshot().lastRebalance!;
    expect(r.action).toBe("add");
    // Ideal is 1/4 = 0.25; allow a generous band for vnode variance.
    expect(r.movedFraction).toBeGreaterThan(0.1);
    expect(r.movedFraction).toBeLessThan(0.45);
  });

  it("only reassigns keys onto the newly added node (no cross-node churn)", () => {
    const eng = new ShardingEngine({ seed: 2, vnodesPerNode: 64, keyCount: 800, initialNodes: 4 });
    const before = eng.debugPlacements();
    const added = eng.addNode();
    const after = eng.debugPlacements();
    let moved = 0;
    for (const [key, prev] of before) {
      if (after.get(key) !== prev) {
        moved++;
        // every moved key must now live on the new node
        expect(after.get(key)).toBe(added.id);
      }
    }
    expect(moved).toBeGreaterThan(0);
  });

  it("only reassigns the removed node's keys when a node leaves", () => {
    const eng = new ShardingEngine({ seed: 3, vnodesPerNode: 64, keyCount: 800, initialNodes: 4 });
    const victim = eng.nodeIds()[1];
    const before = eng.debugPlacements();
    eng.removeNode(victim);
    const after = eng.debugPlacements();
    for (const [key, prev] of before) {
      if (after.get(key) !== prev) {
        // a key only moves if it used to belong to the removed node
        expect(prev).toBe(victim);
        expect(after.get(key)).not.toBe(victim);
      }
    }
  });

  it("distributes keys roughly evenly with enough virtual nodes", () => {
    const eng = new ShardingEngine({ seed: 4, vnodesPerNode: 120, keyCount: 3000, initialNodes: 5 });
    const stats = eng.getSnapshot().stats;
    const ideal = 1 / 5;
    for (const s of stats) {
      expect(s.share).toBeGreaterThan(ideal * 0.55);
      expect(s.share).toBeLessThan(ideal * 1.45);
    }
  });

  it("modulo sharding reshuffles almost everything on a node change (the contrast)", () => {
    const eng = new ShardingEngine({ seed: 5, vnodesPerNode: 64, keyCount: 1000, initialNodes: 3 });
    eng.setStrategy("modulo");
    eng.addNode(); // 3 → 4 nodes under naive hash % N
    const r = eng.getSnapshot().lastRebalance!;
    // Going from N to N+1 under modulo moves roughly N/(N+1) ≈ 75% of keys.
    expect(r.movedFraction).toBeGreaterThan(0.5);
  });

  it("has a stable, deterministic hash", () => {
    expect(fnv1a("user:42")).toBe(fnv1a("user:42"));
    expect(fnv1a("a")).not.toBe(fnv1a("b"));
  });

  it("returns a stable snapshot reference until the next mutation", () => {
    const eng = new ShardingEngine({ seed: 6 });
    const s1 = eng.getSnapshot();
    expect(eng.getSnapshot()).toBe(s1);
    eng.addNode();
    expect(eng.getSnapshot()).not.toBe(s1);
  });
});
