"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Server, Zap, Database } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

export default function ServerMonitor() {
  // Simulated State for "Live" Metrics
  const [latency, setLatency] = useState(24);
  const [requests, setRequests] = useState(1240);
  const [dbLoad, setDbLoad] = useState(42);

  // Update metrics every 2 seconds to simulate activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency((prev) =>
        Math.max(10, Math.min(60, prev + (Math.random() * 10 - 5))),
      );
      setRequests((prev) =>
        Math.max(1000, Math.min(5000, prev + (Math.random() * 200 - 100))),
      );
      setDbLoad((prev) =>
        Math.max(20, Math.min(80, prev + (Math.random() * 10 - 5))),
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* Metric 1: System Status */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.3 }}
        className="col-span-1 md:col-span-6 lg:col-span-3 h-full"
      >
        <SpotlightCard className="p-6 h-full flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase mb-3">
            <Activity size={14} className="text-teal-400" />
            System Status
          </div>
          <div className="text-teal-400 font-display font-bold text-xl md:text-2xl flex items-center gap-2 tracking-tight">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
            Operational
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Metric 2: API Latency */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.4 }}
        className="col-span-1 md:col-span-6 lg:col-span-3 h-full"
      >
        <SpotlightCard className="p-6 h-full flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase mb-3">
            <Zap size={14} className="text-yellow-400" />
            Avg. Latency
          </div>
          <div className="text-slate-200 font-display font-bold text-2xl md:text-3xl tracking-tighter">
            {latency.toFixed(0)}
            <span className="text-lg text-slate-500 ml-1">ms</span>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Metric 3: Throughput */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.5 }}
        className="col-span-1 md:col-span-6 lg:col-span-3 h-full"
      >
        <SpotlightCard className="p-6 h-full flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase mb-3">
            <Server size={14} className="text-purple-400" />
            Req/Sec
          </div>
          <div className="text-slate-200 font-display font-bold text-2xl md:text-3xl tracking-tighter">
            {requests.toFixed(0)}
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Metric 4: DB Load */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.6 }}
        className="col-span-1 md:col-span-6 lg:col-span-3 h-full"
      >
        <SpotlightCard className="p-6 h-full flex flex-col justify-center">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-3">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-blue-400" />
              DB Load
            </div>
            <span className="text-blue-400 font-bold">
              {dbLoad.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 mt-1 overflow-hidden">
            <motion.div
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${dbLoad}%` }}
              animate={{ width: `${dbLoad}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
            />
          </div>
        </SpotlightCard>
      </motion.div>
    </>
  );
}
