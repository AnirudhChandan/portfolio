"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Database, Server, Plus, Minus, Shuffle, Cpu } from "lucide-react";
import { ShardingEngine, type DistributionStat } from "@/lib/sharding";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function ShardingDemo() {
  const isMounted = useIsMounted();

  const [engine] = useState(
    () => new ShardingEngine({ seed: 20240501, vnodesPerNode: 50, keyCount: 600, initialNodes: 3 }),
  );
  const snap = useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getSnapshot);

  const colorByNode = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of snap.stats) m.set(s.nodeId, s.color);
    return m;
  }, [snap.stats]);

  const maxShare = useMemo(
    () => Math.max(0.0001, ...snap.stats.map((s) => s.share)),
    [snap.stats],
  );

  const idealShare = snap.nodes.length ? 1 / snap.nodes.length : 0;
  const reb = snap.lastRebalance;
  const rebalanceIsCheap = reb ? reb.movedFraction <= reb.idealFraction * 1.8 : true;

  if (!isMounted) return <div className="min-h-[500px]" />;

  return (
    <section id="sharding" className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">06.</span> Distributed
          Systems
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
          Scaling isn&apos;t just adding servers — it&apos;s <span className="text-teal-400">where the
          data lives</span>. This is a real{" "}
          <strong className="text-slate-200">consistent-hash ring</strong> (MurmurHash3, virtual
          nodes) over {snap.keyCount} keys. Add or remove a node and watch how few keys actually
          move — then compare against naive <code className="text-purple-300">hash % N</code>.
        </p>
      </div>

      <div className="bg-[#0b0f15] border border-slate-800 rounded-xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-teal-500/5 blur-[100px] pointer-events-none" />

        {/* CONTROLS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 relative z-10">
          <div className="bg-slate-900/50 p-1.5 rounded-lg border border-slate-800 flex items-center">
            {(["consistent", "modulo"] as const).map((s) => (
              <button
                key={s}
                onClick={() => engine.setStrategy(s)}
                className={`px-4 py-2 rounded-md text-sm font-mono transition-all ${
                  snap.strategy === s
                    ? s === "consistent"
                      ? "bg-slate-800 text-teal-400 font-bold border border-slate-700"
                      : "bg-slate-800 text-purple-400 font-bold border border-slate-700"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {s === "consistent" ? "Consistent Hashing" : "Modulo (hash % N)"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => engine.addNode()}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(45,212,191,0.25)] flex items-center gap-2 text-sm"
            >
              <Plus size={16} /> Add Node
            </button>
            <button
              onClick={() => engine.removeLastNode()}
              disabled={snap.nodes.length <= 1}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-all border border-white/5 disabled:opacity-40 flex items-center gap-2 text-sm"
            >
              <Minus size={16} /> Remove
            </button>
            <button
              onClick={() => engine.reshuffleKeys()}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-lg transition-all border border-white/5 flex items-center gap-2 text-sm"
            >
              <Shuffle size={16} />
            </button>
          </div>
        </div>

        {/* vnode slider (consistent only) */}
        {snap.strategy === "consistent" && (
          <div className="flex items-center gap-4 mb-10 relative z-10 font-mono text-xs text-slate-400">
            <span className="uppercase tracking-widest text-slate-500 shrink-0">
              vnodes / node: <span className="text-teal-400 font-bold">{snap.vnodesPerNode}</span>
            </span>
            <input
              type="range"
              min={1}
              max={150}
              value={snap.vnodesPerNode}
              onChange={(e) => engine.setVNodesPerNode(Number(e.target.value))}
              aria-label="Virtual nodes per physical node"
              className="w-full max-w-xs accent-teal-400"
            />
            <span className="text-slate-600 shrink-0 hidden sm:inline">more vnodes → smoother spread</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
          {/* RING PLOT */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center">
            <div className="relative">
              <RingPlot
                vnodes={snap.vnodes}
                colorByNode={colorByNode}
                strategy={snap.strategy}
                nodeCount={snap.nodes.length}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-display font-black text-slate-100">
                  {snap.nodes.length}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  nodes
                </span>
              </div>
            </div>
          </div>

          {/* REBALANCE + RACKS */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Rebalance banner */}
            <div
              className={`rounded-lg border p-4 font-mono text-sm transition-colors ${
                !reb
                  ? "border-slate-800 bg-slate-900/40 text-slate-500"
                  : rebalanceIsCheap
                    ? "border-teal-500/30 bg-teal-500/10 text-teal-300"
                    : "border-red-500/40 bg-red-500/10 text-red-300"
              }`}
            >
              {!reb ? (
                <span>Add or remove a node to measure how many keys must be remapped.</span>
              ) : (
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-bold">
                    {reb.action === "add" ? "Node added" : "Node removed"}:
                  </span>
                  <span className="text-2xl font-black text-slate-100">
                    {(reb.movedFraction * 100).toFixed(1)}%
                  </span>
                  <span>
                    of {reb.total} keys moved ({reb.moved}). Ideal ≈{" "}
                    {(reb.idealFraction * 100).toFixed(0)}%.
                  </span>
                  {!rebalanceIsCheap && (
                    <span className="w-full text-xs mt-1 text-red-300/90">
                      Naive modulo remaps almost the entire keyspace on every topology change — this
                      is the cache-stampede that consistent hashing avoids.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Server racks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {snap.stats.map((s) => (
                <ServerRack key={s.nodeId} stat={s} maxShare={maxShare} idealShare={idealShare} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 text-center border-t border-slate-800 pt-6">
          <p className="text-sm font-mono text-slate-500">
            {snap.strategy === "consistent"
              ? "✅ Consistent hashing: a topology change only remaps keys in the changed node's arcs (~1/N)."
              : "⚠️ Modulo sharding: changing the node count re-maps nearly every key — avoid in production."}
          </p>
        </div>
      </div>
    </section>
  );
}

function RingPlot({
  vnodes,
  colorByNode,
  strategy,
  nodeCount,
}: {
  vnodes: { angle: number; nodeId: string }[];
  colorByNode: Map<string, string>;
  strategy: "consistent" | "modulo";
  nodeCount: number;
}) {
  const size = 240;
  const c = size / 2;
  const r = 92;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full">
      <circle cx={c} cy={c} r={r} fill="none" stroke="#1e293b" strokeWidth={10} />
      {strategy === "consistent" ? (
        vnodes.map((v, i) => {
          const a = v.angle * Math.PI * 2 - Math.PI / 2;
          const x1 = c + (r - 8) * Math.cos(a);
          const y1 = c + (r - 8) * Math.sin(a);
          const x2 = c + (r + 8) * Math.cos(a);
          const y2 = c + (r + 8) * Math.sin(a);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={colorByNode.get(v.nodeId) ?? "#64748b"}
              strokeWidth={2}
              strokeLinecap="round"
            />
          );
        })
      ) : (
        // Modulo mode: evenly split arcs — but every key re-buckets when N changes.
        Array.from({ length: nodeCount }).map((_, i) => {
          const a = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
          const x = c + r * Math.cos(a);
          const y = c + r * Math.sin(a);
          return <circle key={i} cx={x} cy={y} r={6} fill="#a855f7" />;
        })
      )}
    </svg>
  );
}

function ServerRack({
  stat,
  maxShare,
  idealShare,
}: {
  stat: DistributionStat;
  maxShare: number;
  idealShare: number;
}) {
  const hot = stat.share > idealShare * 1.6;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden"
    >
      <div className="h-9 bg-[#050505] border-b border-white/5 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: stat.color }} />
          <span className="font-mono text-[10px] text-slate-400 tracking-widest">{stat.label}</span>
        </div>
        <Server size={12} className="text-slate-600" />
      </div>
      <div className="p-3">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-display font-black text-slate-100">{stat.keyCount}</span>
          <span className={`text-[11px] font-mono ${hot ? "text-amber-400" : "text-slate-500"}`}>
            {(stat.share * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: stat.color }}
            initial={false}
            animate={{ width: `${(stat.share / maxShare) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
          <Cpu size={10} /> keys
          <Database size={10} className="ml-auto" /> shard
        </div>
      </div>
    </motion.div>
  );
}
