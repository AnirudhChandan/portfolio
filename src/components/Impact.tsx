"use client";

import { motion } from "framer-motion";
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
import { Zap, TrendingUp, CheckCircle } from "lucide-react";

// DATA: Latency Reduction (Before vs After)
const latencyData = [
  { name: "Legacy API", ms: 480 },
  { name: "Optimized V2", ms: 288 },
];

// DATA: Efficiency Boost over time
const efficiencyData = [
  { month: "Jan", efficiency: 60 },
  { month: "Feb", efficiency: 65 },
  { month: "Mar", efficiency: 75 },
  { month: "Apr", efficiency: 82 },
  { month: "May", efficiency: 90 },
  { month: "Jun", efficiency: 95 },
];

// 1. Define the specific shape of the payload item
// This satisfies the "no-explicit-any" rule by being specific.
interface PayloadItem {
  value: number | string;
  [key: string]: unknown; // Allows other properties safely
}

// 2. Use that shape in the props interface
interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl">
        <p className="text-slate-200 font-mono text-sm">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function Impact() {
  return (
    <section id="impact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-6 flex items-center gap-4">
            <span className="text-teal-400">05.</span> Measuring Impact
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            Engineering iis not just about code; it is about{" "}
            <span className="text-teal-400">results</span>. Here is the
            quantifiable impact of my backend optimizations at Docplix and
            Genpact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CARD 1: LATENCY REDUCTION */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-teal-400/30 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-teal-400/10 rounded-lg text-teal-400">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-100">
                Latency Reduction
              </h3>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latencyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    unit="ms"
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#334155", opacity: 0.2 }}
                  />
                  <Bar
                    dataKey="ms"
                    fill="#2dd4bf"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-6 text-slate-400 text-sm">
              Reduced patient record retrieval latency by{" "}
              <span className="text-teal-400 font-bold">40%</span> via advanced
              Sequelize indexing.
            </p>
          </div>

          {/* CARD 2: EFFICIENCY BOOST */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-teal-400/30 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-100">
                Pipeline Efficiency
              </h3>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={efficiencyData}>
                  <defs>
                    <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    hide
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#c084fc"
                    fillOpacity={1}
                    fill="url(#colorEff)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-6 text-slate-400 text-sm">
              Boosted tax software processing efficiency by{" "}
              <span className="text-purple-400 font-bold">35%</span> using
              Serverless Python pipelines.
            </p>
          </div>

          {/* CARD 3: RELIABILITY METRIC */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-teal-400/30 transition-colors flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-100">
                Data Consistency
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center h-[200px]">
              <div className="relative">
                {/* Decorative Ring */}
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    className="text-slate-800"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="80"
                    cy="80"
                  />
                  <circle
                    className="text-blue-500"
                    strokeWidth="12"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * 99.9) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="80"
                    cy="80"
                  />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold text-white">99.9%</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                    Uptime
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-slate-400 text-sm">
              Maintained{" "}
              <span className="text-blue-400 font-bold">
                99.9% data consistency
              </span>{" "}
              during critical inventory system migration.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
