"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Zap,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Activity,
} from "lucide-react";
import SpotlightCard from "./SpotlightCard";

// --- DATASETS ---
const LEGACY_DATA = {
  latency: [
    { name: "Avg Response", ms: 480 },
    { name: "P99 Tail", ms: 1250 },
  ],
  efficiency: [
    { month: "Jan", efficiency: 45 },
    { month: "Feb", efficiency: 42 },
    { month: "Mar", efficiency: 48 },
    { month: "Apr", efficiency: 40 },
    { month: "May", efficiency: 35 }, // Degrading over time
    { month: "Jun", efficiency: 30 },
  ],
  consistency: 92.4,
  uptimeColor: "text-red-500",
  strokeColor: "#ef4444", // Red-500
  gradientId: "colorEffLegacy",
};

const OPTIMIZED_DATA = {
  latency: [
    { name: "Avg Response", ms: 45 },
    { name: "P99 Tail", ms: 120 },
  ],
  efficiency: [
    { month: "Jan", efficiency: 60 },
    { month: "Feb", efficiency: 65 },
    { month: "Mar", efficiency: 75 },
    { month: "Apr", efficiency: 82 },
    { month: "May", efficiency: 90 },
    { month: "Jun", efficiency: 95 },
  ],
  consistency: 99.9,
  uptimeColor: "text-teal-400",
  strokeColor: "#2dd4bf", // Teal-400
  gradientId: "colorEffOptimized",
};

// Tooltip Helpers
interface PayloadItem {
  value: number | string;
  [key: string]: unknown;
}
interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-slate-400 font-mono text-[10px] uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-slate-100 font-mono font-bold text-lg">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function Impact() {
  const [mode, setMode] = useState<"legacy" | "optimized">("optimized");
  const isLegacy = mode === "legacy";
  const currentData = isLegacy ? LEGACY_DATA : OPTIMIZED_DATA;

  return (
    <section
      id="impact"
      className="py-24 px-4 md:px-12 max-w-7xl mx-auto scroll-mt-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* SECTION HEADER & TOGGLE */}
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-16 gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-4 flex items-center gap-4 tracking-tight">
              <span className="text-teal-400 font-display font-black text-2xl">
                05.
              </span>
              Measuring Impact
            </h2>
            <p className="text-slate-400 max-w-xl text-lg">
              Compare the performance metrics of the{" "}
              <span className="text-red-400">Legacy Monolith</span> versus my{" "}
              <span className="text-teal-400">Optimized Architecture</span>.
            </p>
          </div>

          {/* THE TOGGLE SWITCH */}
          <div className="bg-slate-900 p-1.5 rounded-xl border border-slate-800 flex items-center shadow-inner">
            <button
              onClick={() => setMode("legacy")}
              className={`relative px-6 py-2.5 rounded-lg text-sm font-bold font-mono transition-colors z-10 ${
                isLegacy
                  ? "text-red-100"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {isLegacy && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-red-600 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <AlertTriangle size={14} /> Legacy Monolith
              </span>
            </button>

            <button
              onClick={() => setMode("optimized")}
              className={`relative px-6 py-2.5 rounded-lg text-sm font-bold font-mono transition-colors z-10 ${
                !isLegacy
                  ? "text-teal-950"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {!isLegacy && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-teal-400 rounded-lg shadow-[0_0_20px_rgba(45,212,191,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Zap size={14} /> Optimized V2.0
              </span>
            </button>
          </div>
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CARD 1: LATENCY */}
          <SpotlightCard
            className="p-8 group flex flex-col h-full"
            spotlightColor={
              isLegacy ? "rgba(239, 68, 68, 0.1)" : "rgba(45, 212, 191, 0.1)"
            }
          >
            <div className="flex items-center justify-between mb-6 relative z-20">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-lg transition-colors duration-500 ${isLegacy ? "bg-red-500/10 text-red-500" : "bg-teal-400/10 text-teal-400"}`}
                >
                  <Activity size={24} />
                </div>
                <h3 className="text-xl font-display font-bold tracking-tight text-slate-100">
                  Latency
                </h3>
              </div>
              <span
                className={`text-xs font-mono px-2 py-1 rounded border ${isLegacy ? "border-red-500/30 text-red-400 bg-red-500/10" : "border-teal-500/30 text-teal-400 bg-teal-500/10"}`}
              >
                {isLegacy ? "CRITICAL" : "HEALTHY"}
              </span>
            </div>

            <div className="h-[220px] w-full relative z-20">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData.latency}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    unit="ms"
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                    content={<CustomTooltip />}
                  />
                  <Bar
                    dataKey="ms"
                    fill={isLegacy ? "#ef4444" : "#2dd4bf"}
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-6 text-slate-400 text-sm relative z-20 flex-grow leading-relaxed">
              {isLegacy
                ? "Legacy N+1 queries caused P99 latency spikes up to 1.2s during high traffic loads."
                : "Optimized indexing and Redis caching reduced average latency to 45ms, a 90% improvement."}
            </p>
          </SpotlightCard>

          {/* CARD 2: EFFICIENCY */}
          <SpotlightCard
            className="p-8 group flex flex-col h-full"
            spotlightColor={
              isLegacy ? "rgba(239, 68, 68, 0.1)" : "rgba(168, 85, 247, 0.1)"
            }
          >
            <div className="flex items-center justify-between mb-6 relative z-20">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-lg transition-colors duration-500 ${isLegacy ? "bg-red-500/10 text-red-500" : "bg-purple-500/10 text-purple-400"}`}
                >
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-display font-bold tracking-tight text-slate-100">
                  Throughput
                </h3>
              </div>
            </div>

            <div className="h-[220px] w-full relative z-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData.efficiency}>
                  <defs>
                    <linearGradient
                      id="colorEffLegacy"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorEffOptimized"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    hide
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="efficiency"
                    stroke={isLegacy ? "#ef4444" : "#c084fc"}
                    fillOpacity={1}
                    fill={`url(#${currentData.gradientId})`}
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-6 text-slate-400 text-sm relative z-20 flex-grow leading-relaxed">
              {isLegacy
                ? "Synchronous processing led to thread blocking and declining throughput under load."
                : "Event-driven architecture (Kafka) decoupled services, boosting throughput by 35%."}
            </p>
          </SpotlightCard>

          {/* CARD 3: CONSISTENCY RING */}
          <SpotlightCard
            className="p-8 flex flex-col h-full group"
            spotlightColor={
              isLegacy ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)"
            }
          >
            <div className="flex items-center justify-between mb-6 relative z-20">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-lg transition-colors duration-500 ${isLegacy ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-400"}`}
                >
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-xl font-display font-bold tracking-tight text-slate-100">
                  Consistency
                </h3>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center h-[220px] relative z-20">
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    className="text-slate-800/50"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="88"
                    cx="96"
                    cy="96"
                  />
                  <motion.circle
                    className={isLegacy ? "text-red-500" : "text-blue-500"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="88"
                    cx="96"
                    cy="96"
                    initial={{ strokeDasharray: 553, strokeDashoffset: 553 }} // 2 * PI * 88 ~= 553
                    animate={{
                      strokeDashoffset:
                        553 - (553 * currentData.consistency) / 100,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                  <span
                    className={`text-5xl font-display font-black tracking-tighter drop-shadow-md transition-colors duration-500 ${isLegacy ? "text-red-500" : "text-white"}`}
                  >
                    {currentData.consistency}%
                  </span>
                  <span
                    className={`text-[10px] font-bold font-mono uppercase tracking-widest mt-2 ${isLegacy ? "text-red-400" : "text-blue-400"}`}
                  >
                    {isLegacy ? "Data Drift" : "Synced"}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-6 text-slate-400 text-sm relative z-20 flex-grow leading-relaxed">
              {isLegacy
                ? "Dual-write anti-patterns caused frequent data mismatches during sync."
                : "Implemented CDC (Change Data Capture) to guarantee 99.9% consistency."}
            </p>
          </SpotlightCard>
        </div>
      </motion.div>
    </section>
  );
}
