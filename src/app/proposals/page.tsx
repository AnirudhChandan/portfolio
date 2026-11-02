import type { Metadata } from "next";
import Link from "next/link";
import { proposals } from "@/lib/proposals";

export const metadata: Metadata = {
  title: "Sample proposals",
  description: "How Anirudh Chandan would plan large systems: architecture, trade-offs, capacity maths, failure modes and delivery stages.",
  alternates: { canonical: "/proposals" },
};

export default function ProposalsPage() {
  return (
    <main className="min-h-screen pt-32 pb-28">
      <div className="max-w-2xl mx-auto px-5">
        <Link href="/#services" className="text-sm text-slate-500 hover:text-teal-400">
          ← Home
        </Link>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-50 tracking-tight leading-tight mt-8 mb-4">Sample proposals</h1>
        <p className="text-lg text-slate-300 leading-relaxed mb-3">
          This is how I would plan a large system: the decisions, what each one costs, the numbers, and what happens when things fail.
        </p>
        <p className="text-slate-400 leading-relaxed mb-10">
          These are samples, not past projects. The clients and figures are invented so you can judge my thinking before we talk. Each one
          links to the real work behind it.
        </p>
        <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {proposals.map((p) => (
            <li key={p.slug}>
              <Link href={`/proposals/${p.slug}`} className="group block py-5">
                <div className="text-sm text-slate-500">{p.field}</div>
                <h2 className="font-display font-bold text-xl text-slate-100 mt-1 group-hover:text-teal-400 transition-colors">{p.title}</h2>
                <p className="text-slate-400 leading-relaxed mt-1">{p.short}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-slate-400 leading-relaxed mt-8">
          Planning something real?{" "}
          <Link href="/#contact" className="text-teal-400 hover:text-teal-300">
            Tell me about it
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
