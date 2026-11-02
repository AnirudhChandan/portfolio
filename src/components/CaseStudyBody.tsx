import type { ReactNode } from "react";
import type { CaseStudy } from "@/lib/work";

export default function CaseStudyBody({ study }: { study: CaseStudy }) {
  return (
    <div className="space-y-10">
      <Block title="The problem">
        <p>{study.problem}</p>
      </Block>
      <Block title="What I did">
        <ul className="space-y-3 list-disc pl-5 marker:text-teal-400">
          {study.approach.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Block>
      <Block title="The result">
        <ul className="space-y-3 list-disc pl-5 marker:text-teal-400">
          {study.outcome.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </Block>
      <Block title="How it's built">
        <p>{study.architecture}</p>
        <p className="text-slate-400 mt-2">Built with {study.tech.join(", ")}.</p>
      </Block>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display font-bold text-2xl text-slate-50 tracking-tight mb-3">{title}</h2>
      <div className="text-lg text-slate-300 leading-relaxed">{children}</div>
    </section>
  );
}
