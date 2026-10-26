import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Github } from "lucide-react";
import CaseStudyBody, { Stats } from "@/components/CaseStudyBody";
import { works } from "@/lib/work";

// One page per case study, so a recruiter or client can be sent a link to a single project.
export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const w = works.find((x) => x.slug === slug);
  if (!w) return {};
  return { title: w.title, description: w.description, alternates: { canonical: `/work/${w.slug}` } };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = works.find((x) => x.slug === slug);
  if (!w) notFound();
  return (
    <main className="min-h-screen pt-32 pb-28">
      <article className="max-w-3xl mx-auto px-5 md:px-8">
        <Link href="/#work" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-400 font-mono text-sm mb-10">
          <ArrowLeft size={16} /> Selected work
        </Link>
        <div className="text-xs font-mono uppercase tracking-[0.25em] text-teal-400 mb-4">Case study · {w.status}</div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-50 tracking-tight leading-tight mb-3">{w.title}</h1>
        <p className="text-sm text-slate-500 mb-8">{w.context}</p>
        {w.stats && (
          <div className="mb-10">
            <Stats stats={w.stats} cols={w.stats.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"} />
          </div>
        )}
        {w.images?.map((img) => (
          <figure key={img.src} className="mb-10">
            <Image src={img.src} alt={img.alt} width={img.width} height={img.height} className="rounded-xl border border-white/[0.07]" sizes="(min-width: 768px) 48rem, 100vw" />
            <figcaption className="text-xs text-slate-500 mt-2">{img.caption}</figcaption>
          </figure>
        ))}
        <CaseStudyBody study={w} />
        <div className="mt-14 pt-8 border-t border-white/[0.07] flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/#contact" className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-teal-400">
            Talk about a project like this <ArrowRight size={16} />
          </Link>
          {w.github && (
            <a href={w.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-mono text-slate-400 hover:text-slate-200">
              <Github size={15} /> Code
            </a>
          )}
          <Link href="/#work" className="text-sm font-mono text-teal-400 hover:text-teal-300">All work →</Link>
        </div>
      </article>
    </main>
  );
}
