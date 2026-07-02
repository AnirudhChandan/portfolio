"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, Zap, ShieldAlert } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

interface Hit {
  i: number;
  status: number;
  remaining: number | null;
  ok: boolean;
  configured: boolean;
}

export default function RateLimitDemo() {
  const [hits, setHits] = useState<Hit[]>([]);
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const fire = async () => {
    if (running) return;
    setRunning(true);
    setHits([]);
    setNote(null);
    // 9 rapid requests against a 5-token bucket → the last few get real 429s.
    for (let i = 0; i < 9; i++) {
      try {
        const res = await fetch("/api/demo/rate-limit", { cache: "no-store" });
        const data = await res.json();
        if (data.configured === false) {
          setNote("Live endpoint responded, but Upstash Redis isn't configured yet — add the env vars to see real 429s.");
          setRunning(false);
          return;
        }
        setHits((prev) => [
          ...prev,
          {
            i,
            status: res.status,
            remaining: typeof data.remaining === "number" ? data.remaining : null,
            ok: res.ok,
            configured: true,
          },
        ]);
      } catch {
        setHits((prev) => [...prev, { i, status: 0, remaining: null, ok: false, configured: true }]);
      }
      await new Promise((r) => setTimeout(r, 130));
    }
    setRunning(false);
  };

  const blocked = hits.filter((h) => h.status === 429).length;

  return (
    <section id="ratelimit" className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">04.</span> Rate Limiter
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
          A real <strong className="text-slate-200">token-bucket rate limiter</strong> on a live
          edge endpoint (Upstash Redis) — 5 tokens, refilling every 10s, per IP. Fire a burst and
          watch genuine <code className="text-red-300">429 Too Many Requests</code> with real{" "}
          <code className="text-teal-300">X-RateLimit-*</code> headers.
        </p>
      </div>

      <SpotlightCard className="p-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Gauge className="text-teal-400" size={22} />
            <div>
              <h3 className="font-bold text-slate-200">GET /api/demo/rate-limit</h3>
              <p className="text-[11px] font-mono text-slate-500">token bucket · 5 / 10s · keyed by IP</p>
            </div>
          </div>
          <button
            onClick={fire}
            disabled={running}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(45,212,191,0.25)]"
          >
            <Zap size={16} className={running ? "animate-pulse" : ""} />
            {running ? "Firing burst…" : "Fire 9 requests"}
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 mb-6 min-h-[64px]">
          <AnimatePresence>
            {hits.map((h) => (
              <motion.div
                key={h.i}
                initial={{ opacity: 0, scale: 0.6, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`rounded-lg border p-2 flex flex-col items-center justify-center font-mono ${
                  h.status === 429
                    ? "border-red-500/50 bg-red-500/10 text-red-300"
                    : h.ok
                      ? "border-teal-500/40 bg-teal-500/10 text-teal-300"
                      : "border-slate-700 bg-slate-800/40 text-slate-400"
                }`}
              >
                <span className="text-sm font-bold">{h.status || "ERR"}</span>
                <span className="text-[9px] text-slate-500">
                  {h.remaining !== null ? `rem ${h.remaining}` : ""}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {note ? (
          <div className="flex items-center gap-3 text-amber-400 text-xs font-mono p-3 bg-amber-500/10 border border-amber-500/20 rounded">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{note}</span>
          </div>
        ) : (
          hits.length > 0 && (
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <ShieldAlert size={16} className={blocked > 0 ? "text-red-400" : "text-slate-600"} />
              <span>
                <span className="text-teal-300">{hits.length - blocked} allowed</span> ·{" "}
                <span className="text-red-300">{blocked} blocked (429)</span> — the bucket refills
                over the next 10 seconds.
              </span>
            </div>
          )
        )}
      </SpotlightCard>
    </section>
  );
}
