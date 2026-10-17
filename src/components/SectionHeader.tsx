import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function SectionHeader({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className="mb-12 md:mb-16 max-w-3xl">
      <div className="text-xs font-mono uppercase tracking-[0.25em] text-teal-400 mb-4">{kicker}</div>
      <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-slate-50 mb-5">
        {title}
      </h2>
      {children && <div className="text-lg text-slate-400 leading-relaxed">{children}</div>}
    </Reveal>
  );
}
