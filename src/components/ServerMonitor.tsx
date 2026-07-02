"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Server, Zap, Globe } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

export default function ServerMonitor() {
  const [latency, setLatency] = useState<number | null>(null);
  const [location, setLocation] = useState("Detecting...");
  const [status, setStatus] = useState("Initializing");
  const [totalRequests, setTotalRequests] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    // Poll the real /api/health edge route: measures round-trip latency and reads
    // a real request counter (Redis INCR) + geo/status. No simulated numbers.
    const checkHealth = async () => {
      const start = performance.now();
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        setLatency(Math.round(performance.now() - start));
        setLocation(data.location ?? "Unknown");
        setStatus(data.status ?? "operational");
        setTotalRequests(typeof data.totalRequests === "number" ? data.totalRequests : null);
      } catch {
        if (active) setStatus("Offline");
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
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
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === "operational" ? "bg-teal-400" : "bg-amber-400"}`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${status === "operational" ? "bg-teal-500" : "bg-amber-500"}`}
              ></span>
            </span>
            {status === "operational" ? "Operational" : status}
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Metric 2: Real User Latency */}
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
            Your Latency
          </div>
          <div className="text-slate-200 font-display font-bold text-2xl md:text-3xl tracking-tighter">
            {latency !== null ? latency : "--"}
            <span className="text-lg text-slate-500 ml-1">ms</span>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Metric 3: User Location (The "Hook") */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.5 }}
        className="col-span-1 md:col-span-6 lg:col-span-3 h-full"
      >
        <SpotlightCard className="p-6 h-full flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase mb-3">
            <Globe size={14} className="text-purple-400" />
            Connected From
          </div>
          <div className="text-slate-200 font-display font-bold text-xl md:text-2xl tracking-tight truncate">
            {location}
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Metric 4: Total Requests (Simulated) */}
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
              <Server size={14} className="text-blue-400" />
              Total Req
            </div>
          </div>
          <div className="text-slate-200 font-display font-bold text-2xl md:text-3xl tracking-tighter">
            {totalRequests !== null ? totalRequests.toLocaleString() : "—"}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 mt-3 overflow-hidden">
            <motion.div
              className="bg-blue-500 h-full rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </div>
        </SpotlightCard>
      </motion.div>
    </>
  );
}
