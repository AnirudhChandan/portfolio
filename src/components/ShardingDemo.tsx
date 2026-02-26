"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Server,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// --- TYPES ---
type ShardStrategy = "range" | "hash";
type DataPacket = { id: number; value: number; shardIndex: number };

export default function ShardingDemo() {
  const [strategy, setStrategy] = useState<ShardStrategy>("range");
  const [data, setData] = useState<DataPacket[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // --- LOGIC: Sharding Algorithms ---

  // 1. Range Sharding: Simple logic based on value ranges
  // Node 0: 0-33, Node 1: 34-66, Node 2: 67-100
  const getRangeShard = (val: number) => {
    if (val < 34) return 0;
    if (val < 67) return 1;
    return 2;
  };

  // 2. Hash Sharding: Modulo arithmetic
  // (Value % 3) determines the node
  const getHashShard = (val: number) => val % 3;

  // --- SIMULATION ---
  const simulateTraffic = () => {
    setIsSimulating(true);
    setData([]); // Clear previous

    let count = 0;
    const interval = setInterval(() => {
      if (count >= 20) {
        // Limit to 20 items for visual clarity
        clearInterval(interval);
        setIsSimulating(false);
        return;
      }

      // Generate a random user ID (0-100)
      // We purposefully skew the random number generation to create "Hot Spots" in Range mode
      // This simulates real-world "trending" data (e.g. everyone accessing recent IDs)
      const randomVal = Math.floor(Math.random() * 40); // Skewed towards lower numbers!

      const shardIndex =
        strategy === "range"
          ? getRangeShard(randomVal)
          : getHashShard(randomVal); // Hash handles skewed data better!

      setData((prev) => [
        ...prev,
        { id: Date.now(), value: randomVal, shardIndex },
      ]);
      count++;
    }, 150);
  };

  // Calculate Load Distribution
  const nodes = [0, 1, 2];
  const distribution = nodes.map(
    (nodeIdx) => data.filter((d) => d.shardIndex === nodeIdx).length,
  );
  const maxLoad = Math.max(...distribution);
  const isUnbalanced = maxLoad > 12; // Threshold for "Hot Shard" warning

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">
            08.
          </span>{" "}
          Distributed Systems
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg">
          Scaling is not just about adding servers; it is about{" "}
          <span className="text-teal-400">Data Distribution</span>. Use this
          simulator to see why I prefer Hash Sharding over Range Sharding for
          high-write workloads.
        </p>
      </div>

      <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-6 md:p-8 shadow-2xl">
        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-2">
                Sharding Strategy
              </span>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => {
                    setStrategy("range");
                    setData([]);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-mono transition-all ${
                    strategy === "range"
                      ? "bg-teal-500 text-slate-900 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Range Based
                </button>
                <button
                  onClick={() => {
                    setStrategy("hash");
                    setData([]);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-mono transition-all ${
                    strategy === "hash"
                      ? "bg-purple-500 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Hash Based
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isUnbalanced && strategy === "range" && (
              <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-2 rounded border border-amber-400/20">
                <AlertTriangle size={16} />
                <span className="text-xs font-bold uppercase">
                  Hot Shard Detected
                </span>
              </div>
            )}
            {strategy === "hash" && data.length > 0 && !isUnbalanced && (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-2 rounded border border-emerald-400/20">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold uppercase">
                  Load Balanced
                </span>
              </div>
            )}

            <button
              onClick={simulateTraffic}
              disabled={isSimulating}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-white text-slate-900 font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={18}
                className={isSimulating ? "animate-spin" : ""}
              />
              {isSimulating ? "Injecting Data..." : "Simulate Traffic"}
            </button>
          </div>
        </div>

        {/* VISUALIZATION NODES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {nodes.map((nodeIdx) => {
            const load = distribution[nodeIdx];
            const isHot = load > 12; // Visual threshold

            return (
              <div
                key={nodeIdx}
                className={`relative min-h-[300px] bg-slate-900 border-2 rounded-xl p-4 transition-colors duration-500 flex flex-col ${
                  isHot
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-slate-700"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Database size={20} />
                    <span className="font-mono font-bold">
                      Shard_0{nodeIdx + 1}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-mono px-2 py-1 rounded ${
                      isHot
                        ? "bg-amber-500 text-slate-900 font-bold"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {load} Records
                  </span>
                </div>

                {/* Data Container */}
                <div className="flex-1 flex flex-wrap content-start gap-2 overflow-hidden">
                  <AnimatePresence>
                    {data
                      .filter((d) => d.shardIndex === nodeIdx)
                      .map((packet) => (
                        <motion.div
                          key={packet.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className={`w-2 h-2 rounded-full ${
                            strategy === "range"
                              ? "bg-teal-400"
                              : "bg-purple-400"
                          }`}
                        />
                      ))}
                  </AnimatePresence>
                </div>

                {/* Server Icon Bottom */}
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-center opacity-20">
                  <Server size={48} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm font-mono">
            {strategy === "range"
              ? "⚠️ Range Sharding creates hotspots when data is sequential or skewed."
              : "✅ Hash Sharding distributes skewed data evenly using (ID % Nodes)."}
          </p>
        </div>
      </div>
    </section>
  );
}
