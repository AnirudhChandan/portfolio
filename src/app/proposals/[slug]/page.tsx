import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import PrintButton from "@/components/PrintButton";
import { proposals } from "@/lib/proposals";

export function generateStaticParams() {
  return proposals.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = proposals.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: `Sample proposal: ${p.title}`, description: p.short, alternates: { canonical: `/proposals/${p.slug}` } };
}

function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display font-bold text-2xl text-slate-50 tracking-tight mb-4 break-after-avoid">{title}</h2>
      <div className="text-slate-300 leading-relaxed">{children}</div>
    </section>
  );
}

export default async function ProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = proposals.find((x) => x.slug === slug);
  if (!p) notFound();
  const row = "py-4 break-inside-avoid";
  return (
    <main className="min-h-screen pt-32 pb-28 print:pt-0 print:pb-0">
      <article className="max-w-2xl mx-auto px-5">
        <div className="flex items-center justify-between gap-4 mb-10 print:hidden">
          <Link href="/proposals" className="text-sm text-slate-500 hover:text-teal-400">
            ← All sample proposals
          </Link>
          <PrintButton event="proposal_print" />
        </div>

        <div className="text-sm text-teal-400 mb-3">Sample proposal · {p.field}</div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-50 tracking-tight leading-tight mb-4">{p.title}</h1>
        <p className="text-xl text-slate-300 leading-relaxed mb-6">{p.short}</p>
        <p className="text-sm text-slate-400 leading-relaxed border-l-2 border-teal-400/60 pl-4">
          This is a sample, not a past project. The client and its numbers are invented to show how I plan a system of this size. Every
          estimate would be replaced with measured figures during discovery. The real work behind it is linked at the end.
        </p>

        <Part title="The situation">
          <p>{p.scenario}</p>
        </Part>

        <Part title="In one minute">
          <ul className="space-y-2 list-disc pl-5 marker:text-teal-400">
            {p.minute.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Part>

        <Part title="What success looks like">
          <dl className="grid sm:grid-cols-3 gap-6 py-5 border-y border-white/[0.07]">
            {p.targets.map((t) => (
              <div key={t.l}>
                <dt className="font-display font-bold text-2xl text-slate-50 tracking-tight">{t.n}</dt>
                <dd className="text-sm text-slate-400 leading-snug mt-1">{t.l}</dd>
              </div>
            ))}
          </dl>
        </Part>

        <Part title="How it fits together">
          <ol className="space-y-2">
            {p.layers.map((l) => (
              <li key={l.name} className="rounded-lg border border-white/10 px-4 py-3 break-inside-avoid">
                <div className="font-semibold text-slate-100">{l.name}</div>
                <div className="text-sm text-slate-400 leading-relaxed mt-0.5">{l.parts}</div>
              </li>
            ))}
          </ol>
        </Part>

        <Part title="The main decisions, and what they cost">
          <div className="space-y-7">
            {p.decisions.map((d) => (
              <div key={d.choice} className="break-inside-avoid">
                <h3 className="font-display font-bold text-lg text-slate-100 mb-1">{d.choice}</h3>
                <p>{d.why}</p>
                <p className="text-slate-400 mt-1">
                  <span className="text-slate-300 font-medium">What it costs:</span> {d.cost}
                </p>
                {d.proof && (
                  <Link href={d.proof.href} className="inline-block text-sm text-teal-400 hover:text-teal-300 mt-1">
                    From real work: {d.proof.label} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Part>

        <Part title="The numbers">
          <p className="mb-4">{p.numbers.takeaway}</p>
          <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {p.numbers.rows.map((r) => (
              <li key={r.label} className={`${row} grid sm:grid-cols-[minmax(0,1fr)_11rem] gap-x-6 gap-y-1`}>
                <div>
                  <div className="font-medium text-slate-100">{r.label}</div>
                  <div className="text-sm text-slate-400 mt-0.5">{r.working}</div>
                </div>
                <div className="text-slate-200 sm:text-right">{r.result}</div>
              </li>
            ))}
          </ul>
        </Part>

        <Part title="When things go wrong">
          <dl className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {p.failures.map((f) => (
              <div key={f.what} className={row}>
                <dt className="font-medium text-slate-100">{f.what}</dt>
                <dd className="text-slate-400 mt-0.5">{f.then}</dd>
              </div>
            ))}
          </dl>
        </Part>

        <Part title="Rules it has to meet">
          <ul className="space-y-2 list-disc pl-5 marker:text-teal-400">
            {p.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Part>

        <Part title="How we would build it">
          <ol className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {p.stages.map((s) => (
              <li key={s.name} className={row}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="font-medium text-slate-100">{s.name}</span>
                  <span className="text-sm text-slate-500">{s.time}</span>
                </div>
                <p className="text-slate-400 mt-0.5">{s.done}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4">
            <span className="font-medium text-slate-100">Team:</span> {p.team} The team and times are estimates until discovery ends.
          </p>
          <p className="mt-2">
            <span className="font-medium text-slate-100">Tools:</span> {p.stack}
          </p>
        </Part>

        <Part title="The real work behind this plan">
          <ul className="space-y-2">
            {p.basis.map((b) => (
              <li key={b.href}>
                <Link href={b.href} className="text-teal-400 hover:text-teal-300">
                  {b.label} →
                </Link>
              </li>
            ))}
          </ul>
        </Part>

        <div className="mt-14 pt-8 border-t border-white/[0.07] print:hidden">
          <Link href="/#contact" className="inline-block rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-teal-400">
            Talk about a system like this
          </Link>
        </div>
        <p className="hidden print:block mt-10 pt-4 border-t border-white/10 text-sm text-slate-500">
          Anirudh Chandan · anirudhchandan.com · Sample proposal, not a past project
        </p>
      </article>
    </main>
  );
}
