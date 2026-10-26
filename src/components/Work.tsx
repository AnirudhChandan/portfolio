"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Github } from "lucide-react";
import CaseStudyPanel from "./CaseStudyPanel";
import { Stats } from "./CaseStudyBody";
import { featured, others, type CaseStudy } from "@/lib/work";
import { track } from "@/lib/track";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

// A real link to /work/<slug> (shareable, opens in a new tab with a modifier key); a plain click
// opens the slide-in panel instead so the reader stays on the page.
function More({ study, open }: { study: CaseStudy; open: (w: CaseStudy) => void }) {
  return (
    <a
      href={`/work/${study.slug}`}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        open(study);
      }}
      className="group inline-flex items-center gap-1.5 text-sm font-mono text-teal-400 hover:text-teal-300"
    >
      Read the case study <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
    </a>
  );
}

export default function Work() {
  const [active, setActive] = useState<CaseStudy | null>(null);
  const open = (w: CaseStudy) => {
    setActive(w);
    track("case_study_open", { title: w.title });
  };

  return (
    <section id="work" className="px-5 md:px-12 max-w-7xl mx-auto scroll-mt-28">
      <SectionHeader kicker="Selected work" title="Systems people rely on">
        Client systems in production, a platform built to outlive its first customer, and the
        self-directed projects where I learn what I rely on.
      </SectionHeader>

      {/* Featured: the one with screenshots */}
      <Reveal>
        <article className="rounded-3xl border border-white/[0.07] bg-slate-900/50 overflow-hidden">
          <div className="grid lg:grid-cols-5">
            <div className="lg:col-span-2 p-6 md:p-10 flex flex-col gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 text-[11px] font-mono text-teal-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> {featured.status}
                  </span>
                  <span className="text-xs text-slate-500">{featured.context}</span>
                </div>
                <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-50 tracking-tight mb-3">
                  {featured.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{featured.description}</p>
              </div>
              <Stats stats={featured.stats} cols="grid-cols-2" />
              <More study={featured} open={open} />
            </div>
            <div className="lg:col-span-3 bg-slate-950/40 p-4 md:p-6 flex flex-col gap-4 justify-center">
              {featured.images?.map((img, i) => (
                <figure key={img.src} className={i > 0 ? "hidden sm:block" : undefined}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    className="rounded-xl border border-white/[0.07]"
                    sizes="(min-width: 1024px) 55vw, 100vw"
                  />
                  <figcaption className="text-xs text-slate-500 mt-2">{img.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </article>
      </Reveal>

      <div className="grid md:grid-cols-6 gap-4 md:gap-5 mt-5">
        {others.map((w, i) => (
          <Reveal key={w.title} delay={0.04 * i} className={`h-full ${i < 2 ? "md:col-span-3" : "md:col-span-2"}`}>
            <article className="h-full rounded-2xl border border-white/[0.07] bg-slate-900/50 p-6 md:p-8 flex flex-col gap-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-mono text-slate-300">
                    {w.status}
                  </span>
                  <span className="text-xs text-slate-500">{w.context}</span>
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-slate-50 tracking-tight mb-2">
                  {w.title}
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">{w.description}</p>
              </div>
              <Stats stats={w.stats} />
              <div className="flex flex-wrap gap-1.5">
                {w.tech.map((t) => (
                  <span key={t} className="text-[11px] font-mono text-slate-400 bg-white/[0.04] rounded px-2 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-5">
                <More study={w} open={open} />
                {w.github && (
                  <a
                    href={w.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-mono text-slate-400 hover:text-slate-200"
                  >
                    <Github size={15} /> Code
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <CaseStudyPanel study={active} onClose={() => setActive(null)} />
    </section>
  );
}
