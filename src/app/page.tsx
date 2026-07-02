"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileText, Calendar } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import Magnetic from "@/components/Magnetic";

// Infrastructure
import { SystemProvider } from "@/components/SystemContext";
import Toaster from "@/components/Toaster";

// Standard Imports
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import ServerMonitor from "@/components/ServerMonitor";
import SpotlightCard from "@/components/SpotlightCard";
import StatsSection from "@/components/StatsSection";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import LabTeaser from "@/components/LabTeaser";

// --- CHANGED: Import TerminalContact instead of Contact ---
import TerminalContact from "@/components/TerminalContact";

// Dynamic import (client-only modal). The heavy interactive demos now live at /lab.
const CommandPalette = dynamic(() => import("@/components/CommandPalette"), {
  ssr: false,
});

function PageContent() {
  useEffect(() => {
    console.log(
      "%c HELLO RECRUITER %c",
      "background: #2dd4bf; color: #020617; font-weight: bold; padding: 4px; border-radius: 4px;",
      "color: #2dd4bf; font-family: monospace;",
    );
    console.table({
      Name: "Anirudh Chandan",
      Specialty: "Distributed Systems & API Design",
      Status: "Open to new opportunities",
      Contact: "anichandan124@gmail.com",
    });
  }, []);

  return (
    <main className="min-h-screen selection:bg-teal-500/30 selection:text-teal-200 relative">
      <Toaster />

      <div className="relative z-10">
        <section
          id="home"
          className="min-h-screen flex flex-col justify-center px-4 md:px-12 max-w-7xl mx-auto pt-32 md:pt-20 scroll-mt-32"
        >
          {/* THE BENTO BOX GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 w-full">
            {/* BLOCK 1: INTRO (Spans 8 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-1 md:col-span-8 lg:col-span-8"
            >
              <SpotlightCard className="p-8 md:p-12 h-full flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-mono w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
                  </span>
                  Available — Senior Backend roles &amp; freelance
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-slate-50 mb-4 tracking-tighter drop-shadow-sm leading-none">
                  Anirudh Chandan.
                </h1>
                <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight text-slate-300 mb-6 drop-shadow-sm">
                  I build scalable backend systems.
                </h2>
                <p className="max-w-xl text-slate-400 text-lg leading-relaxed mb-8">
                  Backend &amp; systems engineer specializing in high-performance
                  APIs, distributed systems, and databases. Creator of the PyDB
                  storage engine.
                </p>

                {/* Proof-stat strip — real, defensible numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 max-w-xl">
                  {[
                    { n: "40%", l: "API latency ↓" },
                    { n: "99.9%", l: "data consistency" },
                    { n: "80%", l: "backend traffic ↓" },
                    { n: "450+", l: "LeetCode solved" },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2"
                    >
                      <div className="text-teal-400 font-display font-black text-xl md:text-2xl tracking-tight">
                        {s.n}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider leading-tight mt-0.5">
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dual CTA — one for recruiters, one for clients */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <Magnetic>
                    <motion.a
                      whileTap={{ scale: 0.95 }}
                      href="/ANIRUDH_CHANDAN_RESUME_2026.pdf"
                      target="_blank"
                      className="px-6 py-3 bg-gradient-to-r from-teal-300 to-cyan-400 text-slate-950 font-bold rounded-lg hover:from-teal-200 hover:to-cyan-300 transition-all font-mono flex items-center gap-2 text-sm shadow-[0_0_24px_rgba(45,212,191,0.45)] hover:shadow-[0_0_36px_rgba(45,212,191,0.65)]"
                    >
                      <FileText size={18} /> Hire me full-time
                    </motion.a>
                  </Magnetic>
                  <Magnetic>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
                      className="px-6 py-3 border border-white/10 text-slate-200 rounded-lg hover:bg-white/5 hover:border-teal-500/30 transition-colors font-mono flex items-center gap-2 text-sm backdrop-blur-sm"
                    >
                      <Calendar size={18} /> Work with me
                    </motion.button>
                  </Magnetic>
                </div>

                <div className="flex items-center gap-6 text-slate-500">
                  <motion.a
                    whileHover={{ y: -3, scale: 1.1 }}
                    href="https://github.com/AnirudhChandan"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Anirudh Chandan on GitHub"
                    className="hover:text-slate-300 transition-colors"
                  >
                    <Github size={24} />
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -3, scale: 1.1 }}
                    href="https://www.linkedin.com/in/anirudh-chandan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Anirudh Chandan on LinkedIn"
                    className="hover:text-slate-300 transition-colors"
                  >
                    <Linkedin size={24} />
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -3, scale: 1.1 }}
                    href="mailto:anichandan124@gmail.com"
                    aria-label="Email Anirudh Chandan"
                    className="hover:text-slate-300 transition-colors"
                  >
                    <Mail size={24} />
                  </motion.a>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* BLOCK 2: PROFILE PICTURE (Spans 4 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-1 md:col-span-4 lg:col-span-4 min-h-[300px] md:min-h-full"
            >
              <SpotlightCard className="w-full h-full p-0 overflow-hidden group relative">
                {/* Duotone tint (teal→purple), lifts on hover to reveal full color */}
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-teal-500/30 via-slate-950/10 to-purple-500/30 pointer-events-none opacity-80 group-hover:opacity-0 transition-opacity duration-700" />
                {/* Bottom fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 pointer-events-none" />
                {/* Scanlines */}
                <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.18] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.4)_3px)]" />
                {/* Viewfinder corner brackets */}
                <div className="absolute inset-4 z-20 pointer-events-none">
                  <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-teal-400/60" />
                  <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-teal-400/60" />
                  <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-teal-400/60" />
                  <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-teal-400/60" />
                </div>
                {/* Status label */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 font-mono text-[10px] text-teal-300 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> operator
                </div>
                <Image
                  src="/profile.jpeg"
                  alt="Anirudh Chandan"
                  fill
                  className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 scale-100 group-hover:scale-105"
                  priority
                />
              </SpotlightCard>
            </motion.div>

            {/* BLOCK 3: SERVER METRICS (4 Mini Cards integrated into grid) */}
            <ServerMonitor />
          </div>
        </section>

        <div className="flex flex-col gap-32 pb-32 mt-32">
          <Experience />
          <StatsSection />
          <Projects />
          <LabTeaser />
          <Services />
          <Testimonials />
          <TerminalContact />
        </div>

        <footer className="border-t border-white/5 py-10 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm font-mono">
          <span>© 2026 Anirudh Chandan · Built with Next.js &amp; TypeScript</span>
          <div className="flex items-center gap-6">
            <a href="/blog" className="hover:text-teal-400 transition-colors">
              Writing
            </a>
            <a
              href="https://github.com/AnirudhChandan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/anirudh-chandan/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://leetcode.com/u/crytondre/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-400 transition-colors"
            >
              LeetCode
            </a>
            <a
              href="/ANIRUDH_CHANDAN_RESUME_2026.pdf"
              target="_blank"
              className="hover:text-teal-400 transition-colors"
            >
              Résumé
            </a>
          </div>
        </footer>
      </div>

      <CommandPalette />
    </main>
  );
}

export default function Home() {
  return (
    <SystemProvider>
      <PageContent />
    </SystemProvider>
  );
}
