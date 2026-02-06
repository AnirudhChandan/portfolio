"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Server, Zap, Database } from "lucide-react";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-12 p-1 rounded-xl bg-gradient-to-r from-teal-400/20 to-purple-500/20"
    >
      <div className="bg-slate-950/90 backdrop-blur-sm rounded-lg p-6 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Metric 1: System Status */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase">
            <Activity size={14} className="text-teal-400" />
            System Status
          </div>
          <div className="text-teal-400 font-bold font-mono text-xl flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
            Operational
          </div>
        </div>

        {/* Metric 2: API Latency */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase">
            <Zap size={14} className="text-yellow-400" />
            Avg. Latency
          </div>
          <div className="text-slate-200 font-bold font-mono text-xl">
            {latency.toFixed(0)}ms
          </div>
        </div>

        {/* Metric 3: Throughput */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase">
            <Server size={14} className="text-purple-400" />
            Req/Sec
          </div>
          <div className="text-slate-200 font-bold font-mono text-xl">
            {requests.toFixed(0)}
          </div>
        </div>

        {/* Metric 4: DB Load */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase">
            <Database size={14} className="text-blue-400" />
            DB Load
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 mt-2">
            <motion.div
              className="bg-blue-400 h-2.5 rounded-full"
              style={{ width: `${dbLoad}%` }}
              animate={{ width: `${dbLoad}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
