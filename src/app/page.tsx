"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileText, ChevronDown } from "lucide-react";
import Image from "next/image";

// Infrastructure
import { SystemProvider } from "@/components/SystemContext";
import Toaster from "@/components/Toaster";
// import CommandPalette from "@/components/";
// import ChaosControl from "@/components/ChaosControl";

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
import SpotlightCard from "@/components/SpotlightCard";
import StorageVisualizer from "@/components/StorageVisualizer"; // <--- NEW

function PageContent() {
  return (
    <main className="min-h-screen selection:bg-teal-500 selection:text-white relative">
      <Toaster />
      {/* <CommandPalette />
      <ChaosControl /> */}

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/0 via-slate-900/80 to-slate-950"></div>
      </div>

      <Navbar />

      <div className="relative z-10">
        <section
          id="home"
          className="min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto pt-28 md:pt-0"
        >
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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
                Software Engineer specializing in high-performance APIs and
                distributed architectures. Creator of PyDB storage engine.
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] flex-shrink-0"
            >
              <SpotlightCard className="w-full h-full p-2 rounded-2xl border-slate-700 bg-slate-800/50">
                <div className="relative w-full h-full rounded-xl overflow-hidden group">
                  <Image
                    src="/profile.jpeg"
                    alt="Anirudh"
                    fill
                    className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
                    priority
                  />
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
          <ServerMonitor />
        </section>
        <Experience />
        <Projects />
        <StorageVisualizer /> {/* <--- Showcase the Database Project */}
        <Architecture />
        <Impact />
        <ApiPlayground />
        <CodeComparison />
        <ShardingDemo />
        <Contact />
      </div>
      <AiChatbot />
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
