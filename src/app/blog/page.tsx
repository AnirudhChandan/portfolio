import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on systems, databases, and building things from scratch — by Anirudh Chandan.",
};

export default function BlogIndex() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-32">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-400 transition-colors font-mono text-sm mb-12"
      >
        <ArrowLeft size={16} /> Home
      </Link>

      <h1 className="text-4xl md:text-6xl font-display font-black text-slate-100 tracking-tighter mb-4">
        Writing
      </h1>
      <p className="text-slate-400 text-lg mb-16">
        Notes on systems, databases, and things I&apos;ve had to fix at 2am.
      </p>

      <div className="flex flex-col gap-4">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group block rounded-xl border border-white/5 bg-slate-900/40 p-6 md:p-8 hover:border-teal-500/30 transition-colors"
          >
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-3">
              <span className="text-teal-400">{p.tag}</span>
              <span>{p.date}</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {p.read}
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-100 group-hover:text-teal-400 transition-colors tracking-tight mb-2">
              {p.title}
            </h2>
            <p className="text-slate-400 leading-relaxed">{p.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-teal-400 font-mono text-sm">
              Read <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
