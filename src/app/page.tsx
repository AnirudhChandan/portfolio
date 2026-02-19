"use client";

import dynamic from "next/dynamic"; // <--- 1. Import dynamic
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileText, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

// Infrastructure
import { SystemProvider } from "@/components/SystemContext";
import Toaster from "@/components/Toaster";

import Navbar from "@/components/Navbar";

// Standard Imports (Lightweight)
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import ServerMonitor from "@/components/ServerMonitor";
import SpotlightCard from "@/components/SpotlightCard";

// 2. Dynamic Imports (Heavy Components - Load only when needed)
const Architecture = dynamic(() => import("@/components/Architecture"), {
  ssr: false,
});
const StorageVisualizer = dynamic(
  () => import("@/components/StorageVisualizer"),
  { ssr: false },
);
const Impact = dynamic(() => import("@/components/Impact"), { ssr: false });
const ApiPlayground = dynamic(() => import("@/components/ApiPlayground"), {
  ssr: false,
});
const CodeComparison = dynamic(() => import("@/components/CodeComparison"), {
  ssr: false,
});
const ShardingDemo = dynamic(() => import("@/components/ShardingDemo"), {
  ssr: false,
});
const AiChatbot = dynamic(() => import("@/components/AiChatbot"), {
  ssr: false,
});

function PageContent() {
  // 3. THE CONSOLE EASTER EGG
  useEffect(() => {
    console.log(
      "%c HELLO RECRUITER %c",
      "background: #2dd4bf; color: #020617; font-weight: bold; padding: 4px; border-radius: 4px;",
      "color: #2dd4bf; font-family: monospace;",
    );
    console.log(
      "Looking for a Senior Backend/Fullstack Engineer? You found him.",
    );
    console.table({
      Name: "Anirudh Chandan",
      Specialty: "Distributed Systems & API Design",
      Status: "Open to new opportunities",
      Contact: "anichandan124@gmail.com",
    });
  }, []);

  return (
    <main className="min-h-screen selection:bg-teal-500 selection:text-white relative">
      <Toaster />

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
                  className="px-6 py-3 border border-teal-400 text-teal-400 rounded hover:bg-teal-400/10 transition-colors font-mono text-sm"
                >
                  Check out my work
                </a>
                <a
                  href="/ANIRUDH_CHANDAN_RESUME_2026.pdf"
                  target="_blank"
                  className="px-6 py-3 bg-slate-800 text-slate-200 rounded hover:bg-slate-700 transition-colors font-mono flex items-center gap-2 text-sm"
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

        {/* Dynamic sections: they will only load when the user nears them */}
        <Experience />
        <Projects />
        <StorageVisualizer />
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
