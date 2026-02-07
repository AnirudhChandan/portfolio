"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileText, ChevronDown } from "lucide-react";
import Image from "next/image"; // <--- Import Image component

// Components
import Navbar from "@/components/Navbar";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import ServerMonitor from "@/components/ServerMonitor";
import Architecture from "@/components/Architecture";
import Impact from "@/components/Impact";
import ApiPlayground from "@/components/ApiPlayground";
import CodeComparison from "@/components/CodeComparison";
import AiChatbot from "@/components/AiChatbot";
import ShardingDemo from "@/components/ShardingDemo";
import SpotlightCard from "@/components/SpotlightCard"; // <--- We use this for the profile pic wrapper

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-teal-500 selection:text-white relative">
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/0 via-slate-900/80 to-slate-950"></div>
      </div>

      <Navbar />

      <div className="relative z-10">
        {/* --- HERO SECTION --- */}
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto pt-28 md:pt-0">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 mb-16">
            {/* LEFT SIDE: TEXT */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 text-center md:text-left"
            >
              <span className="text-teal-400 font-mono text-lg mb-4 block">
                Hi, my name is
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-4 tracking-tight">
                Anirudh Chandan.
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-400 mb-6">
                I build scalable backend systems.
              </h2>
              <p className="max-w-xl text-slate-400 text-lg leading-relaxed mb-8 mx-auto md:mx-0">
                I am a Software Engineer based in India, specializing in
                high-performance APIs and distributed architectures. From
                architecting 30+ endpoints at{" "}
                <span className="text-teal-400">Docplix</span> to optimizing
                pipelines at <span className="text-teal-400">Genpact</span>.
              </p>

              <div className="flex flex-wrap gap-4 mb-10 justify-center md:justify-start">
                <a
                  href="#projects"
                  className="px-6 py-3 border border-teal-400 text-teal-400 rounded hover:bg-teal-400/10 transition-colors font-mono"
                >
                  Check out my work
                </a>
                <a
                  href="/ANIRUDH_CHANDAN_RESUME_2026.pdf"
                  target="_blank"
                  className="px-6 py-3 bg-slate-800 text-slate-200 rounded hover:bg-slate-700 transition-colors font-mono flex items-center gap-2"
                >
                  <FileText size={18} /> Resume
                </a>
              </div>

              <div className="flex items-center gap-6 text-slate-400 justify-center md:justify-start">
                <a
                  href="https://github.com/anichandan124"
                  target="_blank"
                  className="hover:text-teal-400 hover:-translate-y-1 transition-all"
                >
                  <Github size={24} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  className="hover:text-teal-400 hover:-translate-y-1 transition-all"
                >
                  <Linkedin size={24} />
                </a>
                <a
                  href="mailto:anichandan124@gmail.com"
                  className="hover:text-teal-400 hover:-translate-y-1 transition-all"
                >
                  <Mail size={24} />
                </a>
              </div>
            </motion.div>

            {/* RIGHT SIDE: PROFILE IMAGE (Using SpotlightCard) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] flex-shrink-0"
            >
              <SpotlightCard
                className="w-full h-full p-2 rounded-2xl border-slate-700 bg-slate-800/50"
                spotlightColor="rgba(45, 212, 191, 0.25)"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden group">
                  {/* THE IMAGE */}
                  <Image
                    src="/profile.jpeg" // <--- Ensure this file exists in /public
                    alt="Anirudh Chandan"
                    fill
                    className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                    priority
                  />

                  {/* Subtle Gradient Overlay (Fades image slightly at bottom) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>

                  {/* Status Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 shadow-xl z-20">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                    </span>
                    <span className="text-xs font-mono text-slate-300 font-bold">
                      Open to Work
                    </span>
                  </div>
                </div>
              </SpotlightCard>

              {/* Decorative Blur Blobs behind the image */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -z-10"></div>
            </motion.div>
          </div>

          <ServerMonitor />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500 hidden md:block"
          >
            <ChevronDown size={30} />
          </motion.div>
        </section>

        {/* REST OF SECTIONS */}
        <Experience />
        <Projects />
        <Architecture />
        <Impact />
        <ApiPlayground />
        <CodeComparison />
        <ShardingDemo />
        <Contact />

        <footer className="py-6 text-center text-slate-500 text-sm font-mono bg-transparent">
          <a
            href="https://github.com/anichandan124"
            target="_blank"
            className="hover:text-teal-400 transition-colors"
          >
            Designed & Built by Anirudh Chandan
          </a>
        </footer>
      </div>

      <AiChatbot />
    </main>
  );
}
