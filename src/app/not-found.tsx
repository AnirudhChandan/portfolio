import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Route Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-lg bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden font-mono shadow-2xl">
        <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert size={12} className="text-amber-400" /> guest@anirudh.dev
          </span>
          <span className="w-10" />
        </div>

        <div className="p-8 text-sm">
          <p className="text-slate-500">$ cd {"{requested-route}"}</p>
          <p className="text-red-400 mt-1">bash: cd: no such route</p>

          <div className="text-7xl md:text-8xl font-display font-black text-slate-100 my-8 tracking-tighter">
            404
          </div>

          <p className="text-slate-400 leading-relaxed">
            This page was never allocated. The request resolved, but there&apos;s no page mapped to
            this path.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-slate-950 font-bold rounded-lg hover:bg-teal-400 transition-colors text-sm shadow-[0_0_20px_rgba(45,212,191,0.3)]"
          >
            <ArrowLeft size={16} /> Return to root
          </Link>
        </div>
      </div>
    </main>
  );
}
