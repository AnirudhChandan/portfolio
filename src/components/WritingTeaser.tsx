import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import Reveal from "./Reveal";
import { posts } from "@/lib/posts";

// The three newest posts, straight from the same list the blog index renders.
export default function WritingTeaser() {
  const latest = posts.slice(0, 3);
  return (
    <section id="writing" className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-32">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-4 flex items-center gap-4 tracking-tight">
              <span className="text-teal-400 font-display font-black text-2xl">04.</span> Writing
            </h2>
            <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
              Write-ups of real problems: what broke, why, and what fixed it.
            </p>
          </div>
          <Link
            href="/blog"
            className="shrink-0 group inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/10 text-slate-200 hover:bg-white/5 hover:border-teal-500/30 transition-colors font-mono text-sm"
          >
            All {posts.length} posts
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {latest.map((p, i) => (
          <Reveal key={p.slug} delay={0.06 * i} className="h-full">
            <Link
              href={`/blog/${p.slug}`}
              className="group flex flex-col h-full rounded-xl border border-white/5 bg-slate-900/40 p-6 hover:border-teal-500/30 hover:bg-slate-900/60 transition-colors"
            >
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest mb-3">
                {p.tag}
              </span>
              <h3 className="font-display font-bold text-lg text-slate-100 leading-snug tracking-tight mb-3 group-hover:text-teal-300 transition-colors">
                {p.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-grow">{p.excerpt}</p>
              <span className="mt-5 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                <Clock size={12} /> {p.read}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
