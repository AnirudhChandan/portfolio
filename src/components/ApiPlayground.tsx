"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Loader2,
  Terminal,
  CheckCircle,
  AlertCircle,
  Copy,
} from "lucide-react";

// --- MOCK ENDPOINTS BASED ON YOUR RESUME ---
const endpoints = [
  {
    id: "auth",
    method: "POST",
    path: "/api/v1/auth/login",
    desc: "Authenticates user and issues JWT.",
    body: {
      email: "user@example.com",
      password: "••••••••",
    },
    response: {
      status: "success",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      user: {
        id: "u_123",
        role: "admin",
      },
      expiresIn: 3600,
    },
  },
  {
    id: "movie",
    method: "GET",
    path: "/api/v1/movies/recommend?id=tt1375666",
    desc: "ML-based Cosine Similarity recommendation.",
    body: null,
    response: {
      movieId: "tt1375666",
      algorithm: "cosine_similarity",
      recommendations: [
        { title: "Inception", score: 0.98 },
        { title: "Interstellar", score: 0.94 },
        { title: "The Prestige", score: 0.89 },
      ],
      latency: "45ms",
    },
  },
  {
    id: "sync",
    method: "GET",
    path: "/api/v2/inventory/sync-status",
    desc: "Checks consistency between Legacy & V2 systems.",
    body: null,
    response: {
      syncId: "sync_9982",
      status: "HEALTHY",
      discrepancies: 0,
      lastSync: "2026-02-05T10:00:00Z",
      consistency: "99.99%",
    },
  },
];

export default function ApiPlayground() {
  const [selectedId, setSelectedId] = useState(endpoints[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<null | object>(null);
  const [status, setStatus] = useState<null | number>(null);

  const activeEndpoint =
    endpoints.find((e) => e.id === selectedId) || endpoints[0];

  const handleSend = () => {
    setIsLoading(true);
    setResponse(null);
    setStatus(null);

    // Simulate Network Latency (600ms - 1200ms)
    setTimeout(
      () => {
        setIsLoading(false);
        setStatus(200);
        setResponse(activeEndpoint.response);
      },
      Math.random() * 600 + 600,
    );
  };

  return (
    <section
      id="playground"
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
              06.
            </span>{" "}
            API Playground
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            Do not just take my word for it.{" "}
            <span className="text-teal-400">Test the architecture</span>{" "}
            yourself. Interact with simulated endpoints from my actual projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[600px]">
          {/* --- LEFT SIDEBAR: ENDPOINT LIST --- */}
          <div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-slate-900">
              <h3 className="text-slate-400 font-mono text-xs uppercase tracking-wider">
                Available Endpoints
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {endpoints.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    setSelectedId(ep.id);
                    setResponse(null);
                    setStatus(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all border ${
                    selectedId === ep.id
                      ? "bg-slate-800 border-teal-500/50"
                      : "hover:bg-slate-800/50 border-transparent hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        ep.method === "POST"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-slate-500 text-xs font-mono">
                      JSON
                    </span>
                  </div>
                  <div className="text-slate-300 font-mono text-xs truncate">
                    {ep.path}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT PANEL: REQUEST/RESPONSE --- */}
          <div className="lg:col-span-8 bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
            {/* URL BAR */}
            <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 items-center bg-slate-900/50">
              <div className="flex-1 w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 font-mono text-sm text-slate-300 flex items-center gap-3">
                <span
                  className={`font-bold ${
                    activeEndpoint.method === "POST"
                      ? "text-purple-400"
                      : "text-blue-400"
                  }`}
                >
                  {activeEndpoint.method}
                </span>
                <span className="truncate">{activeEndpoint.path}</span>
              </div>
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Play size={18} />
                )}
                Send
              </button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 p-6 font-mono text-sm overflow-y-auto">
              {/* DESCRIPTION */}
              <div className="mb-6">
                <h4 className="text-slate-500 text-xs uppercase mb-2">
                  Endpoint Description
                </h4>
                <p className="text-slate-300">{activeEndpoint.desc}</p>
              </div>

              {/* REQUEST BODY (Only if POST) */}
              {activeEndpoint.body && (
                <div className="mb-6">
                  <h4 className="text-slate-500 text-xs uppercase mb-2">
                    Request Body
                  </h4>
                  <pre className="text-orange-300 bg-slate-900/50 p-4 rounded-lg border border-slate-800 overflow-x-auto">
                    {JSON.stringify(activeEndpoint.body, null, 2)}
                  </pre>
                </div>
              )}

              {/* RESPONSE AREA */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-slate-500 text-xs uppercase">Response</h4>
                  {status && (
                    <span className="text-xs flex items-center gap-1 text-green-400">
                      <CheckCircle size={12} /> Status: {status} OK
                    </span>
                  )}
                </div>

                <div className="relative min-h-[200px] bg-[#010409] rounded-lg border border-slate-800 p-4">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center flex-col gap-3 text-slate-500"
                      >
                        <Loader2 className="animate-spin" size={32} />
                        <span>Sending Request...</span>
                      </motion.div>
                    ) : response ? (
                      <motion.pre
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-400 overflow-x-auto"
                      >
                        {JSON.stringify(response, null, 2)}
                      </motion.pre>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-600 flex-col gap-2">
                        <Terminal size={32} />
                        <span>Hit Send to test endpoint</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
