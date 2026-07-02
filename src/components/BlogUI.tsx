import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

// Shared, server-rendered building blocks for blog articles.

export function Code({ children }: { children: string }) {
  return (
    <pre className="my-6 overflow-x-auto rounded-xl border border-white/5 bg-[#020408] p-4 text-[13px] leading-relaxed font-mono text-slate-300">
      <code>{children}</code>
    </pre>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return <div className="text-slate-300 text-lg leading-relaxed space-y-6">{children}</div>;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-100 tracking-tight mb-5">
        {title}
      </h2>
      <div className="text-slate-300 text-lg leading-relaxed space-y-5">{children}</div>
    </section>
  );
}

export function ArticleLayout({
  tag,
  date,
  read,
  title,
  children,
}: {
  tag: string;
  date: string;
  read: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-32">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-400 transition-colors font-mono text-sm mb-12"
      >
        <ArrowLeft size={16} /> Writing
      </Link>

      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-5">
        <span className="text-teal-400">{tag}</span>
        <span>{date}</span>
        <span className="flex items-center gap-1">
          <Clock size={12} /> {read}
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl font-display font-black text-slate-100 tracking-tighter leading-tight mb-8">
        {title}
      </h1>

      {children}
    </main>
  );
}

export function DemoCTA({
  href,
  title,
  desc,
  label,
}: {
  href: string;
  title: string;
  desc: string;
  label: string;
}) {
  return (
    <div className="mt-16 rounded-xl border border-teal-500/20 bg-teal-500/[0.06] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <div className="font-display font-bold text-slate-100 text-lg">{title}</div>
        <div className="text-slate-400 text-sm mt-1">{desc}</div>
      </div>
      <Link
        href={href}
        className="shrink-0 px-6 py-3 bg-teal-500 text-slate-950 font-bold rounded-lg hover:bg-teal-400 transition-colors font-mono flex items-center gap-2 text-sm"
      >
        {label} <ArrowRight size={16} />
      </Link>
    </div>
  );
}
