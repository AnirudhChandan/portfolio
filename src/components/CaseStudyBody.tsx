import type { ReactNode } from "react";
import { Target, Wrench, GitBranch, TrendingUp } from "lucide-react";
import type { CaseStudy, Work } from "@/lib/work";

// Shared by the slide-in panel on the home page and the /work/<slug> page.
export function Stats({ stats, cols = "grid-cols-3" }: { stats?: Work["stats"]; cols?: string }) {
  if (!stats) return null;
  return (
    <div className={`grid ${cols} gap-2.5`}>
      {stats.map((s) => (
        <div key={s.l} className="rounded-lg border border-white/[0.07] bg-slate-950/40 px-3 py-2.5">
          <div className="font-display font-bold text-base md:text-lg text-slate-50 tracking-tight whitespace-nowrap">{s.n}</div>
          <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{s.l}</div>
        </div>
      ))}
    </div>
  );
}

export default function CaseStudyBody({ study }: { study: CaseStudy }) {
  return (
    <div className="space-y-10">
      <p className="text-slate-300 leading-relaxed">{study.description}</p>

      <Block icon={<Target size={16} />} title="The problem">
        <p className="text-slate-400 leading-relaxed">{study.problem}</p>
      </Block>

      <Block icon={<Wrench size={16} />} title="The approach">
        <ul className="space-y-2">
          {study.approach.map((a, i) => (
            <li key={i} className="flex gap-3 text-slate-400 leading-relaxed">
              <span className="text-teal-500 shrink-0 mt-1">▸</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block icon={<GitBranch size={16} />} title="Architecture">
        <p className="font-mono text-sm text-teal-300/90 bg-slate-900/60 border border-white/5 rounded-lg p-4 leading-relaxed">
          {study.architecture}
        </p>
      </Block>

      <Block icon={<TrendingUp size={16} />} title="Outcome">
        <ul className="space-y-2">
          {study.outcome.map((o, i) => (
            <li key={i} className="flex gap-3 text-slate-300 leading-relaxed">
              <span className="text-emerald-400 shrink-0 mt-1">✓</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </Block>

      <div className="flex flex-wrap gap-2 pt-2">
        {study.tech.map((t) => (
          <span
            key={t}
            className="text-[10px] font-mono text-teal-400/90 bg-teal-400/10 px-2.5 py-1 rounded border border-teal-400/20 uppercase tracking-tighter"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Block({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 text-slate-200 font-bold text-sm">
        <span className="text-teal-400">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}
