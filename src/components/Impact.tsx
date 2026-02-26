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
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-slate-200 font-mono text-sm">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function Impact() {
  return (
    <section
      id="impact"
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center gap-4 tracking-tight">
            <span className="text-teal-400 font-display font-black text-2xl">
              05.
            </span>{" "}
            Measuring Impact
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            Engineering is not just about code; it is about{" "}
            <span className="text-teal-400">results</span>. Here is the
            quantifiable impact of my backend optimizations at Docplix and
            Genpact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CARD 1: LATENCY REDUCTION */}
          <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl transition-all hover:bg-slate-900/60 group">
            {/* Glass highlight edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"></div>

            <div className="flex items-center gap-3 mb-6 relative z-20">
              <div className="p-3 bg-teal-400/10 rounded-lg text-teal-400">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-display font-bold tracking-tight text-slate-100">
                Latency Reduction
              </h3>
            </div>

            <div className="h-[200px] w-full relative z-20">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latencyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
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
                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
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

            <p className="mt-6 text-slate-400 text-sm relative z-20">
              Reduced patient record retrieval latency by{" "}
              <span className="text-teal-400 font-bold">40%</span> via advanced
              Sequelize indexing.
            </p>
          </div>

          {/* CARD 2: EFFICIENCY BOOST */}
          <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl transition-all hover:bg-slate-900/60 group">
            {/* Glass highlight edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"></div>

            <div className="flex items-center gap-3 mb-6 relative z-20">
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-display font-bold tracking-tight text-slate-100">
                Pipeline Efficiency
              </h3>
            </div>

            <div className="h-[200px] w-full relative z-20">
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
                    stroke="rgba(255,255,255,0.05)"
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

            <p className="mt-6 text-slate-400 text-sm relative z-20">
              Boosted tax software processing efficiency by{" "}
              <span className="text-purple-400 font-bold">35%</span> using
              Serverless Python pipelines.
            </p>
          </div>

          {/* CARD 3: RELIABILITY METRIC */}
          <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl transition-all hover:bg-slate-900/60 flex flex-col justify-between group">
            {/* Glass highlight edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"></div>

            <div className="flex items-center gap-3 relative z-20">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-display font-bold tracking-tight text-slate-100">
                Data Consistency
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center h-[200px] relative z-20">
              <div className="relative">
                {/* Decorative Ring - Thinned out for elegance */}
                <svg className="w-44 h-44 transform -rotate-90">
                  <circle
                    className="text-slate-800/50"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="80"
                    cx="88"
                    cy="88"
                  />
                  <circle
                    className="text-blue-500"
                    strokeWidth="8"
                    strokeDasharray={502} // 2 * PI * 80
                    strokeDashoffset={502 - (502 * 99.9) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="80"
                    cx="88"
                    cy="88"
                  />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                  {/* High-impact Display Font for the metric */}
                  <span className="text-5xl font-display font-black tracking-tighter text-white drop-shadow-md">
                    99.9%
                  </span>
                  <span className="text-[10px] text-blue-400 font-bold font-mono uppercase tracking-widest mt-1">
                    Uptime
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-slate-400 text-sm relative z-20">
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
