"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import RecruiterCard from "@/components/RecruiterCard";
import Services from "@/components/Services";
import SourceNote from "@/components/SourceNote";
import Work from "@/components/Work";
import WritingTeaser from "@/components/WritingTeaser";
import { audiences, type Audience } from "@/lib/audience";
import type { SourceId } from "@/lib/sources";
import { track } from "@/lib/track";

// Every number here is on the résumé or in portfolio-in/FACTS.md; src/lib/sources.ts says where.
const proof: { n: string; l: string; src: SourceId }[] = [
  { n: "2,300+", l: "clinics on a platform I build for", src: "clinics" },
  { n: "15.6s → 2.4s", l: "one slow page, after my fix", src: "nPlusOne" },
  { n: "Sep 2026", l: "CCTV dashboard in daily use since", src: "cctv" },
];

// feather and peacock are server-rendered SVG passed in from the page, so they ship no JavaScript.
export default function HomePage({
  audience = "default",
  feather,
  peacock,
}: {
  audience?: Audience;
  feather?: ReactNode;
  peacock?: ReactNode;
}) {
  const a = audiences[audience];
  const forRecruiters = audience !== "default";
  return (
    <main className="min-h-screen relative">
      <section id="home" className="max-w-4xl mx-auto px-5 md:px-8 pt-32 md:pt-44 pb-24 scroll-mt-28">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_16rem] gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="font-display font-bold tracking-tight text-slate-50 text-5xl leading-[1.05] mb-6">
              Anirudh Chandan
            </h1>
            <p className="font-display text-2xl text-slate-200 tracking-tight leading-snug mb-4">{a.headline}</p>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              The systems behind clinics, construction companies and security teams. Based in India, open to remote
              roles and freelance work.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={a.resume}
                target="_blank"
                onClick={() => track("resume_download", { audience, from: "hero" })}
                className="rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-teal-400"
              >
                Download résumé
              </a>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
                className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/5"
              >
                Book a free call
              </button>
            </div>
          </div>

          <div className="relative max-w-64 w-full mx-auto lg:mx-0">
            {feather}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/[0.07] bg-slate-900">
              <Image src="/profile.jpeg" alt="Anirudh Chandan" fill priority className="object-cover" sizes="(min-width: 1024px) 16rem, 16rem" />
            </div>
          </div>
        </div>

        <dl className="grid sm:grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/[0.07]">
          {proof.map((p) => (
            <div key={p.l}>
              <dt className="font-display font-bold text-2xl text-slate-50 tracking-tight">{p.n}</dt>
              <dd className="text-sm text-slate-400 leading-snug mt-1">
                <SourceNote id={p.src}>{p.l}</SourceNote>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="flex flex-col gap-24 md:gap-32 pb-24">
        {forRecruiters && <RecruiterCard audience={audience} />}
        <Work />
        <Experience />
        {!forRecruiters && <Services />}
        <WritingTeaser />
        <Contact />
      </div>

      {peacock && <div className="max-w-4xl mx-auto px-5 md:px-8 flex justify-end">{peacock}</div>}
      <footer className="max-w-4xl mx-auto px-5 md:px-8 py-10 border-t border-white/[0.07] flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
        <span>© 2026 Anirudh Chandan</span>
        <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
          <a href="https://github.com/AnirudhChandan" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">GitHub</a>
          <a href="https://www.linkedin.com/in/anirudh-chandan/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">LinkedIn</a>
          <a href="https://leetcode.com/u/crytondre/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">LeetCode</a>
          <Link href="/proposals" className="hover:text-teal-400">Sample proposals</Link>
          <a href="/now" className="hover:text-teal-400">Now</a>
          <a href="/checklist" className="hover:text-teal-400">Hiring a developer?</a>
        </nav>
      </footer>
    </main>
  );
}
