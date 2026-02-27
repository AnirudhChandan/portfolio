"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Server, RefreshCw, Cpu, Zap, Activity } from "lucide-react";

// --- TYPES ---
type ShardStrategy = "range" | "hash";
type DataPacket = { id: number; value: number; shardIndex: number };

// --- CONSTANTS ---
const SHARD_COUNT = 3;
const MAX_CAPACITY = 16; // Visual cap per server for demo purposes

export default function ShardingDemo() {
  const [strategy, setStrategy] = useState<ShardStrategy>("range");
  const [data, setData] = useState<DataPacket[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Track "flying" packets for animation effects
  const [flyingPackets, setFlyingPackets] = useState<DataPacket[]>([]);

  // --- LOGIC ---
  const getRangeShard = (val: number) => {
    if (val < 34) return 0;
    if (val < 67) return 1;
    return 2;
  };

  const getHashShard = (val: number) => val % SHARD_COUNT;

  const simulateTraffic = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setData([]);
    setFlyingPackets([]);

    let count = 0;
    const interval = setInterval(() => {
      if (count >= 30) {
        clearInterval(interval);
        setIsSimulating(false);
        return;
      }

      // Generate skewed data for Range Strategy (Hotspot on Shard 0)
      // Generate uniform data for Hash Strategy
      let randomVal;
      if (strategy === "range") {
        // 80% chance of hitting the "Hot" range (0-33)
        randomVal =
          Math.random() < 0.8
            ? Math.floor(Math.random() * 30)
            : Math.floor(Math.random() * 100);
      } else {
        randomVal = Math.floor(Math.random() * 100);
      }

      const shardIndex =
        strategy === "range"
          ? getRangeShard(randomVal)
          : getHashShard(randomVal);
      const newPacket = {
        id: Date.now() + count,
        value: randomVal,
        shardIndex,
      };

      // 1. Add to "Flying" state (Travels from Load Balancer)
      setFlyingPackets((prev) => [...prev, newPacket]);

      // 2. After delay, move to "Stored" state (Lands on Server)
      setTimeout(() => {
        setFlyingPackets((prev) => prev.filter((p) => p.id !== newPacket.id));
        setData((prev) => [...prev, newPacket]);
      }, 600); // Flight time

      count++;
    }, 200); // Packet frequency
  };

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
          simulator to observe how <strong>Hash Sharding</strong> prevents the
          Hot Shard meltdowns common in Range-based strategies.
        </p>
      </div>

      <div className="bg-[#0b0f15] border border-slate-800 rounded-xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-teal-500/5 blur-[100px] pointer-events-none" />

        {/* --- CONTROLS HEADER --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 relative z-10">
          {/* Strategy Toggle */}
          <div className="bg-slate-900/50 p-1.5 rounded-lg border border-slate-800 flex items-center">
            <button
              onClick={() => {
                setStrategy("range");
                setData([]);
              }}
              className={`px-4 py-2 rounded-md text-sm font-mono transition-all ${
                strategy === "range"
                  ? "bg-slate-800 text-teal-400 font-bold shadow-lg border border-slate-700"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Range Sharding
            </button>
            <button
              onClick={() => {
                setStrategy("hash");
                setData([]);
              }}
              className={`px-4 py-2 rounded-md text-sm font-mono transition-all ${
                strategy === "hash"
                  ? "bg-slate-800 text-purple-400 font-bold shadow-lg border border-slate-700"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Hash Sharding
            </button>
          </div>

          {/* Action Button */}
          <button
            onClick={simulateTraffic}
            disabled={isSimulating}
            className="group relative px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] flex items-center gap-2"
          >
            <RefreshCw
              size={18}
              className={`transition-transform ${isSimulating ? "animate-spin" : "group-hover:rotate-180"}`}
            />
            {isSimulating ? "Injecting Traffic..." : "Simulate 10k Requests"}
          </button>
        </div>

        {/* --- SIMULATION STAGE --- */}
        <div className="relative">
          {/* 1. LOAD BALANCER NODE (Top Center) */}
          <div className="flex justify-center mb-16 relative">
            <div className="w-48 h-16 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center gap-3 shadow-2xl relative z-20">
              <Server size={20} className="text-blue-400" />
              <span className="text-slate-200 font-mono text-xs font-bold tracking-wider">
                LOAD_BALANCER
              </span>

              {/* Traffic Lights */}
              <div className="flex gap-1.5 absolute right-3 top-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-75" />
              </div>

              {/* Flying Packets Container (Origin Point) */}
              <AnimatePresence>
                {flyingPackets.map((packet) => (
                  <Packet key={packet.id} targetShard={packet.shardIndex} />
                ))}
              </AnimatePresence>
            </div>

            {/* Wires */}
            <svg
              className="absolute top-16 left-0 w-full h-16 pointer-events-none z-0"
              style={{ overflow: "visible" }}
            >
              <path
                d="M 50% 0 L 50% 20 L 15% 20 L 15% 60"
                fill="none"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <path
                d="M 50% 0 L 50% 60"
                fill="none"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <path
                d="M 50% 0 L 50% 20 L 85% 20 L 85% 60"
                fill="none"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* 2. SERVER RACKS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[0, 1, 2].map((nodeIdx) => {
              const shardData = data.filter((d) => d.shardIndex === nodeIdx);
              const load = shardData.length;
              const isOverloaded = load > 12; // Visual threshold for "Hot"
              const isCritical = load > 18; // Visual threshold for "Meltdown"

              return (
                <ServerRack
                  key={nodeIdx}
                  id={nodeIdx}
                  load={load}
                  data={shardData}
                  status={
                    isCritical
                      ? "critical"
                      : isOverloaded
                        ? "warning"
                        : "healthy"
                  }
                />
              );
            })}
          </div>
        </div>

        {/* --- FOOTER EXPLANATION --- */}
        <div className="mt-16 text-center border-t border-slate-800 pt-8">
          <p
            className={`text-sm font-mono transition-colors duration-300 ${
              strategy === "range" && data.length > 5
                ? "text-amber-400"
                : "text-slate-500"
            }`}
          >
            {strategy === "range"
              ? "⚠️ ALERT: Range Sharding causes uneven distribution. Notice Shard_01 melting down due to sequential ID hotspots."
              : "✅ STATUS: Hash Sharding distributes load uniformly using consistent hashing (ID % NodeCount)."}
          </p>
        </div>
      </div>
    </section>
  );
}

// --- SUB-COMPONENTS ---

// 1. The Flying Packet Particle
const Packet = ({ targetShard }: { targetShard: number }) => {
  // Calculate X offset based on target shard (Approximate percentages for 3 columns)
  // 0 -> -35% (Left), 1 -> 0% (Center), 2 -> 35% (Right)
  const xOffset = targetShard === 0 ? -300 : targetShard === 1 ? 0 : 300;

  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
      animate={{ y: 180, x: xOffset, opacity: 0, scale: 0.5 }} // Fly down and horizontal
      transition={{ duration: 0.6, ease: "circIn" }}
      className="absolute top-8 left-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] z-50 pointer-events-none"
    />
  );
};

// 2. The Physical Server Rack Unit
const ServerRack = ({
  id,
  load,
  data,
  status,
}: {
  id: number;
  load: number;
  data: DataPacket[];
  status: "healthy" | "warning" | "critical";
}) => {
  // Dynamic Styles based on Status
  const statusStyles = {
    healthy: {
      border: "border-slate-800",
      bg: "bg-slate-900",
      glow: "shadow-none",
      indicator: "bg-emerald-500",
      text: "text-slate-400",
    },
    warning: {
      border: "border-amber-500/50",
      bg: "bg-amber-950/20",
      glow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]",
      indicator: "bg-amber-500",
      text: "text-amber-400",
    },
    critical: {
      border: "border-red-500",
      bg: "bg-red-950/30",
      glow: "shadow-[0_0_50px_rgba(239,68,68,0.4)]",
      indicator: "bg-red-500",
      text: "text-red-500",
    },
  };

  const style = statusStyles[status];

  return (
    <motion.div
      // Shaking animation if critical
      animate={status === "critical" ? { x: [-1, 1, -1] } : {}}
      transition={{ repeat: Infinity, duration: 0.1 }}
      className={`relative min-h-[320px] rounded-xl border-2 transition-all duration-300 flex flex-col overflow-hidden ${style.border} ${style.bg} ${style.glow}`}
    >
      {/* Rack Header (Ventilation) */}
      <div className="h-12 bg-[#050505] border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex gap-2">
          {/* Blinking Status Lights */}
          <div
            className={`w-2 h-2 rounded-full ${style.indicator} animate-pulse`}
          />
          <div className="w-2 h-2 rounded-full bg-slate-700" />
          <div className="w-2 h-2 rounded-full bg-slate-700" />
        </div>
        <span className="font-mono text-[10px] text-slate-600 tracking-widest">
          UNIT_0{id + 1}
        </span>
      </div>

      {/* Rack Body (Data Storage) */}
      <div className="flex-1 p-4 relative">
        {/* Background Grid inside Server */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

        <div className="relative z-10 flex flex-wrap content-start gap-1.5">
          <AnimatePresence>
            {data.map((packet) => (
              <motion.div
                key={packet.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-3 h-3 rounded-[1px] ${
                  status === "critical"
                    ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                    : status === "warning"
                      ? "bg-amber-500"
                      : "bg-teal-500"
                }`}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Rack Footer (Metrics) */}
      <div className="bg-[#050505] border-t border-white/5 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono">
            <Database size={12} />
            <span>STORAGE</span>
          </div>
          <span className={`text-[10px] font-bold font-mono ${style.text}`}>
            {load} / {MAX_CAPACITY} TB
          </span>
        </div>

        {/* CPU Load Bar */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono">
            <Cpu size={12} />
            <span>CPU LOAD</span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${style.indicator}`}
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min((load / 20) * 100, 100)}%` }}
          />
        </div>

        {/* CRITICAL WARNING OVERLAY */}
        {status === "critical" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center z-50 backdrop-blur-sm"
          >
            <Activity className="text-red-500 mb-2 animate-bounce" size={32} />
            <span className="text-red-500 font-black font-display tracking-widest text-lg">
              OVERHEAT
            </span>
            <span className="text-red-400 font-mono text-[10px]">
              CPU THRESHOLD EXCEEDED
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
