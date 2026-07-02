"use client";

import { Quote } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import Reveal from "./Reveal";

// ⚠️ PLACEHOLDER TESTIMONIALS — replace `quote`, `name`, and `role` with real,
// attributable endorsements (e.g. from a manager or client) before relying on
// these. They are intentionally generic so nothing false is attributed to a
// named person.
const testimonials = [
  {
    quote:
      "Anirudh has a rare instinct for where systems break under load, and the discipline to fix the root cause rather than the symptom.",
    name: "Engineering Manager",
    role: "former team lead",
  },
  {
    quote:
      "He shipped a complex backend migration with zero downtime and left the codebase cleaner than he found it. I'd work with him again in a heartbeat.",
    name: "Senior Engineer",
    role: "collaborator",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
      <Reveal>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[10px] font-mono text-teal-400 uppercase tracking-[0.3em]">
            Endorsements
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map((t, i) => (
          <Reveal key={i} delay={0.08 * i}>
            <SpotlightCard className="p-8 h-full flex flex-col">
              <Quote size={28} className="text-teal-500/40 mb-4" />
              <p className="text-slate-300 text-lg leading-relaxed flex-grow">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="text-slate-100 font-bold text-sm">{t.name}</div>
                <div className="text-slate-500 font-mono text-xs">{t.role}</div>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
