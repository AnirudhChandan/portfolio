"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, FileText, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import Experience from "@/components/Experience";
import { FeatherDivider } from "@/components/FeatherEye";
import RecruiterCard from "@/components/RecruiterCard";
import { audiences, type Audience } from "@/lib/audience";
import { track } from "@/lib/track";
import LabTeaser from "@/components/LabTeaser";
import Receipts from "@/components/Receipts";
import Services from "@/components/Services";
import StatsSection from "@/components/StatsSection";
import TerminalContact from "@/components/TerminalContact";
import Work from "@/components/Work";
import WritingTeaser from "@/components/WritingTeaser";

// Every number here is on the résumé or in portfolio-in/FACTS.md.
const proof = [
  { n: "2,300+", l: "clinic tenants on a platform I build for" },
  { n: "711 / 1,100", l: "commits on a 20-tenant ERP" },
  { n: "15.6s → 2.4s", l: "after auditing 53 screens for N+1s" },
  { n: "Sep 2026", l: "CCTV dashboard live on site since" },
];

const paths = (resume: string) => [
  {
    kicker: "Hiring?",
    title: "Screening answers, résumé and proof",
    desc: "Remote backend, full-stack and applied-AI roles.",
    href: "#hiring",
    cta: { label: "Download résumé", href: resume, icon: FileText },
  },
  {
    kicker: "Need something built?",
    title: "Services, client work, how a project runs",
    desc: "Dashboards, integrations, backends and websites, built to keep working.",
    href: "#services",
    cta: { label: "Book a free call", href: "#book", icon: Calendar },
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

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
  return (
    <main className="min-h-screen relative">
      <section id="home" className="px-5 md:px-12 max-w-7xl mx-auto pt-32 md:pt-40 pb-20 scroll-mt-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-8">
            <motion.div {...fade()} className="inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full border border-teal-500/20 bg-teal-500/[0.08] text-teal-400 text-xs font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              Open to remote backend &amp; AI roles · taking freelance work
            </motion.div>
            <motion.h1 {...fade(0.05)} className="font-display font-bold tracking-tight text-slate-50 text-5xl sm:text-6xl md:text-7xl leading-[0.95] mb-6">
              Anirudh Chandan
            </motion.h1>
            <motion.p {...fade(0.1)} className="font-display text-2xl md:text-3xl text-slate-300 tracking-tight leading-snug mb-6 max-w-2xl">
              {a.headline}
            </motion.p>
            <motion.p {...fade(0.15)} className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-10">
              2.5+ years in Node.js/TypeScript and Python on PostgreSQL: APIs for a healthcare platform used by
              2,300+ clinics, a modernised 20-tenant ERP, and a CCTV dashboard a guard team uses every night.
              Every claim below links to proof.
            </motion.p>

            <motion.dl {...fade(0.2)} className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 max-w-3xl mb-10">
              {proof.map((p) => (
                <div key={p.l} className="border-l border-white/10 pl-4">
                  <dt className="font-display font-bold text-xl md:text-2xl text-slate-50 tracking-tight">{p.n}</dt>
                  <dd className="text-xs text-slate-500 leading-snug mt-1">{p.l}</dd>
                </div>
              ))}
            </motion.dl>

            <motion.div {...fade(0.25)} className="flex items-center gap-5 text-slate-400">
              <a href="https://github.com/AnirudhChandan" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-slate-100 transition-colors"><Github size={20} /></a>
              <a href="https://www.linkedin.com/in/anirudh-chandan/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-slate-100 transition-colors"><Linkedin size={20} /></a>
              <a href="mailto:anichandan124@gmail.com" onClick={() => track("email_click", { from: "hero" })} aria-label="Email" className="hover:text-slate-100 transition-colors"><Mail size={20} /></a>
              <span className="text-sm font-mono text-slate-500">India · remote</span>
            </motion.div>
          </div>

          <motion.div {...fade(0.1)} className="relative lg:col-span-4 max-w-sm w-full mx-auto lg:mx-0">
            {feather}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/[0.07] bg-slate-900">
              <Image src="/profile.jpeg" alt="Anirudh Chandan" fill priority className="object-cover" sizes="(min-width: 1024px) 30vw, 80vw" />
            </div>
          </motion.div>
        </div>

        <motion.div {...fade(0.3)} className="grid md:grid-cols-2 gap-4 mt-16">
          {paths(a.resume).map((p) => (
            <div key={p.kicker} className="group rounded-2xl border border-white/[0.07] bg-slate-900/50 p-6 md:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-5 rim-feather">
              <a href={p.href} className="block">
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-teal-400 mb-2">{p.kicker}</div>
                <div className="font-display font-bold text-xl text-slate-50 mb-1 inline-flex items-center gap-2">
                  {p.title} <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-sm text-slate-400">{p.desc}</p>
              </a>
              {p.cta.href === "#book" ? (
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/5"
                >
                  <p.cta.icon size={16} /> {p.cta.label}
                </button>
              ) : (
                <a
                  href={p.cta.href}
                  target="_blank"
                  onClick={() => track("resume_download", { audience, from: "hero" })}
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-teal-400"
                >
                  <p.cta.icon size={16} /> {p.cta.label}
                </a>
              )}
            </div>
          ))}
        </motion.div>
      </section>

      <div className="flex flex-col gap-28 md:gap-36 pb-28">
        <RecruiterCard audience={audience} />
        <Receipts first={a.receiptsFirst} />
        <Work />
        <Experience />
        <StatsSection />
        <FeatherDivider />
        <Services />
        <LabTeaser />
        <WritingTeaser />
        <FeatherDivider />
        <TerminalContact />
      </div>

      {peacock && <div className="max-w-7xl mx-auto px-5 md:px-12 flex justify-end">{peacock}</div>}
      <footer className="border-t border-white/[0.07] py-10 px-5 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
        <span>
          © 2026 Anirudh Chandan ·{" "}
          <a href="https://github.com/AnirudhChandan/portfolio" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">
            source
          </a>
        </span>
        <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
          <a href="/lab" className="hover:text-teal-400">Lab</a>
          <a href="/blog" className="hover:text-teal-400">Writing</a>
          <a href="https://github.com/AnirudhChandan" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">GitHub</a>
          <a href="https://www.linkedin.com/in/anirudh-chandan/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">LinkedIn</a>
          <a href="https://leetcode.com/u/crytondre/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">LeetCode</a>
          <a href="/now" className="hover:text-teal-400">Now</a>
          <a href="/checklist" className="hover:text-teal-400">Hiring a developer?</a>
          <a href={a.resume} target="_blank" className="hover:text-teal-400">Résumé</a>
        </nav>
      </footer>
    </main>
  );
}
