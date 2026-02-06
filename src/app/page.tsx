"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileText, ChevronDown } from "lucide-react";

// Import all your custom components
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import ServerMonitor from "@/components/ServerMonitor";
import Architecture from "@/components/Architecture";
import Impact from "@/components/Impact";
import ApiPlayground from "@/components/ApiPlayground";
import AiChatbot from "@/components/AiChatbot"; // Import the Chatbot

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-teal-500 selection:text-white">
      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto relative pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-teal-400 font-mono text-lg mb-4 block">
            Hi, my name is
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-4 tracking-tight">
            Anirudh Chandan.
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-400 mb-6">
            I build scalable backend systems.
          </h2>
          <p className="max-w-xl text-slate-400 text-lg leading-relaxed mb-8">
            I am a Software Engineer based in India, specializing in
            high-performance APIs and distributed architectures. From
            architecting 30+ endpoints at{" "}
            <span className="text-teal-400">Docplix</span> to optimizing
            pipelines at <span className="text-teal-400">Genpact</span>.
          </p>

          <div className="flex gap-4 mb-12">
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

          <div className="flex items-center gap-6 text-slate-400 mb-12">
            <a
              href="https://github.com/anichandan124"
              target="_blank"
              className="hover:text-teal-400 transition-colors hover:-translate-y-1 transform duration-300"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              className="hover:text-teal-400 transition-colors hover:-translate-y-1 transform duration-300"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:anichandan124@gmail.com"
              className="hover:text-teal-400 transition-colors hover:-translate-y-1 transform duration-300"
            >
              <Mail size={24} />
            </a>
          </div>

          {/* 1. Server Monitor Component */}
          <ServerMonitor />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500"
        >
          <ChevronDown size={30} />
        </motion.div>
      </section>

      {/* 2. Experience Component */}
      <Experience />

      {/* 3. Projects Component */}
      <Projects />

      {/* 4. Architecture Component */}
      <Architecture />

      {/* 5. Impact Component */}
      <Impact />

      {/* 6. API Playground Component */}
      <ApiPlayground />

      {/* 7. Contact Component */}
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

      {/* 8. AI Chatbot (Floating Overlay) */}
      <AiChatbot />
    </main>
  );
}
