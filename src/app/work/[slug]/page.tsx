import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CaseStudyBody from "@/components/CaseStudyBody";
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
  return { title: w.title, description: w.short, alternates: { canonical: `/work/${w.slug}` } };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = works.find((x) => x.slug === slug);
  if (!w) notFound();
  return (
    <main className="min-h-screen pt-32 pb-28">
      <article className="max-w-2xl mx-auto px-5">
        <Link href="/#work" className="text-sm text-slate-500 hover:text-teal-400">
          ← All work
        </Link>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-50 tracking-tight leading-tight mt-8 mb-4">{w.title}</h1>
        <p className="text-xl text-slate-300 leading-relaxed mb-3">{w.short}</p>
        <p className="text-sm text-slate-500 mb-10">{w.context}</p>

        {w.stats && (
          <dl className="grid grid-cols-3 gap-4 mb-10 py-6 border-y border-white/[0.07]">
            {w.stats.map((s) => (
              <div key={s.l}>
                <dt className="font-display font-bold text-xl md:text-2xl text-slate-50 tracking-tight">{s.n}</dt>
                <dd className="text-sm text-slate-400 leading-snug mt-1">{s.l}</dd>
              </div>
            ))}
          </dl>
        )}

        {w.image && (
          <figure className="mb-10">
            <Image src={w.image.src} alt={w.image.alt} width={w.image.width} height={w.image.height} className="rounded-xl border border-white/[0.07]" sizes="(min-width: 672px) 42rem, 100vw" />
            <figcaption className="text-sm text-slate-500 mt-2">{w.image.caption}</figcaption>
          </figure>
        )}

        <CaseStudyBody study={w} />

        <div className="mt-14 pt-8 border-t border-white/[0.07] flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/#contact" className="rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-teal-400">
            Talk about a project like this
          </Link>
          {w.github && (
            <a href={w.github} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-teal-400">
              See the code →
            </a>
          )}
        </div>
      </article>
    </main>
  );
}
