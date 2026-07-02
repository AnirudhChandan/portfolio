"use client";

import { Server, Gauge, Boxes, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

const services = [
  {
    icon: <Server size={24} />,
    title: "Backend Architecture",
    desc: "Design and build scalable APIs, microservices, and event-driven systems that hold up under real load.",
  },
  {
    icon: <Boxes size={24} />,
    title: "Distributed Systems & Data",
    desc: "Queues, caching, sharding, and database modeling — the hard parts of scaling a data-heavy product.",
  },
  {
    icon: <Gauge size={24} />,
    title: "Performance & Reliability",
    desc: "Profiling, N+1 elimination, rate limiting, and observability to make slow systems fast and stable.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-32">
      <Reveal>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">05.</span> Work with me
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
          Available for freelance and contract work — typically <strong className="text-slate-200">4–12 week</strong>{" "}
          backend builds, performance audits, or system-design partnerships.
        </p>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={0.08 * i}>
            <div className="group relative h-full rounded-xl border border-white/5 bg-slate-900/40 p-8 overflow-hidden hover:border-teal-500/20 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
              <div className="p-3 w-fit bg-slate-800/50 rounded-xl text-teal-400 border border-white/5 mb-6 group-hover:-translate-y-0.5 transition-transform">
                {s.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-slate-100 mb-3 tracking-tight">
                {s.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-teal-500/20 bg-teal-500/[0.06] p-6">
          <div>
            <div className="font-display font-bold text-slate-100 text-lg">
              Have a system that needs to scale?
            </div>
            <div className="text-slate-400 text-sm mt-1">
              Book a free 30-minute intro call — I&apos;ll tell you honestly if I can help.
            </div>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
            className="shrink-0 px-6 py-3 bg-teal-500 text-slate-950 font-bold rounded-lg hover:bg-teal-400 transition-colors font-mono flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(45,212,191,0.3)]"
          >
            Book a call <ArrowRight size={16} />
          </button>
        </div>
      </Reveal>
    </section>
  );
}
