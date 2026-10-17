import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NOW_UPDATED, now } from "@/lib/now";

export const metadata: Metadata = {
  title: "Now",
  description: "What Anirudh Chandan is building, running and learning right now.",
};

export default function NowPage() {
  return (
    <main className="min-h-screen pt-32 pb-28">
      <div className="max-w-3xl mx-auto px-5 md:px-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-400 font-mono text-sm mb-10">
          <ArrowLeft size={16} /> Home
        </Link>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-50 tracking-tight mb-3">Now</h1>
        <p className="text-slate-400 mb-12">What I&apos;m building, running and learning. Updated {NOW_UPDATED}.</p>
        <ol className="relative border-l border-white/10 ml-1.5 space-y-9">
          {now.map((n) => (
            <li key={n.text} className="pl-8 relative">
              <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-teal-400 ring-4 ring-slate-950" />
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-teal-400">{n.kind}</span>
                <span className="text-xs font-mono text-slate-500">{n.when}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{n.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
