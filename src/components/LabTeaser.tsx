"use client";

import Link from "next/link";
import { Database, Network, Gauge, GitBranch, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

const demos = [
  {
    icon: <Database size={20} />,
    title: "PyDB Storage Engine",
    desc: "A real B+Tree with a pager and write-ahead log. Insert keys, watch pages split.",
    href: "/lab#storage",
  },
  {
    icon: <Network size={20} />,
    title: "Consistent Hashing",
    desc: "A real hash ring with virtual nodes. Add a node, measure how few keys move.",
    href: "/lab#sharding",
  },
  {
    icon: <Gauge size={20} />,
    title: "Rate Limiter",
    desc: "A live token bucket on an edge route. Fire a burst, get real 429s.",
    href: "/lab#ratelimit",
  },
  {
    icon: <GitBranch size={20} />,
    title: "System Architecture",
    desc: "The interactive map of the inventory migration system behind it all.",
    href: "/lab#architecture",
  },
];

export default function LabTeaser() {
  return (
    <section id="lab" className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-32">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-4 flex items-center gap-4 tracking-tight">
              <span className="text-purple-400 font-display font-black text-2xl">04.</span> The Lab
            </h2>
            <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
              I don&apos;t just describe systems, I build them. These run for real in your browser.
            </p>
          </div>
          <Link
            href="/lab"
            className="shrink-0 group inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 transition-colors font-mono text-sm"
          >
            Enter the Lab
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {demos.map((d, i) => (
          <Reveal key={d.title} delay={0.06 * i}>
            <Link
              href={d.href}
              className="group block h-full rounded-xl border border-white/5 bg-[#0b0f15] overflow-hidden hover:border-teal-500/30 transition-colors"
            >
              <div className="h-8 bg-[#050505] border-b border-white/5 flex items-center gap-1.5 px-3">
                <span className="w-2 h-2 rounded-full bg-red-500/40" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/40" />
                <span className="w-2 h-2 rounded-full bg-green-500/40" />
              </div>
              <div className="p-5">
                <div className="p-2.5 w-fit rounded-lg bg-slate-800/50 text-teal-400 border border-white/5 mb-4 group-hover:text-teal-300 transition-colors">
                  {d.icon}
                </div>
                <h3 className="font-display font-bold text-slate-100 mb-2 tracking-tight group-hover:text-teal-400 transition-colors">
                  {d.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{d.desc}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
