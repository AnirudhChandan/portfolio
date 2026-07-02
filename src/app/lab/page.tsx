import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LabContent from "@/components/LabContent";

export const metadata: Metadata = {
  title: "The Lab",
  description:
    "Interactive systems demos that run for real in your browser: a B+Tree storage engine with a write-ahead log, a consistent-hash ring, live rate limiting, and the architecture behind them.",
};

export default function LabPage() {
  return (
    <main className="min-h-screen pt-32">
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-400 transition-colors font-mono text-sm mb-10"
        >
          <ArrowLeft size={16} /> Home
        </Link>

        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] font-mono text-purple-400 uppercase tracking-[0.3em]">
            The Lab
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <h1 className="text-4xl md:text-6xl font-display font-black text-slate-100 tracking-tighter leading-tight mb-4">
          Interactive systems demos
        </h1>
        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
          Everything here runs for real, client-side: a{" "}
          <span className="text-teal-300">B+Tree storage engine</span> with a write-ahead log, a{" "}
          <span className="text-teal-300">consistent-hash ring</span>, a{" "}
          <span className="text-teal-300">live token-bucket rate limiter</span>, and the architecture
          tying it together. No mock data. The pure-logic pieces are covered by unit tests.
        </p>
      </section>

      <LabContent />
    </main>
  );
}
