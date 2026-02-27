"use client";

import { motion } from "framer-motion";
import {
  Github,
  ExternalLink,
  Folder,
  Database,
  HardDrive,
  Zap,
} from "lucide-react";
import SpotlightCard from "./SpotlightCard";

const heroProject = {
  title: "PyDB: Storage Engine",
  description:
    "A disk-based relational B-Tree storage engine implemented in Python. Features a custom Disk Pager, WAL for ACID compliance, and raw binary serialization using struct packing. Engineered to handle high-throughput reads/writes with strict O(log n) performance.",
  tech: ["Python", "B-Tree", "Binary Serialization", "File I/O", "ACID"],
  github: "https://github.com/anichandan124",
  link: "#",
};

const otherProjects = [
  {
    title: "Real-Time Chat Architecture",
    description:
      "A scalable full-stack chat platform engineered for high concurrency. Features real-time bi-directional communication, websocket connection pooling, and persistent message storage.",
    tech: ["Node.js", "Socket.io", "React", "MongoDB"],
    github: "https://github.com/anichandan124",
    link: "#",
  },
  {
    title: "Inventory Sync Engine",
    description:
      "Built for Docplix. A background worker service that synchronizes legacy SQL data with modern NoSQL cloud storage, handling conflict resolution, race conditions, and retry logic at scale.",
    tech: ["Typescript", "PostgreSQL", "BullMQ", "Redis"],
    github: "https://github.com/anichandan124",
    link: "#",
  },
];

const hexBytes = [
  "0x00",
  "0x1A",
  "0x2F",
  "0xFF",
  "0x4C",
  "0x8B",
  "0x9E",
  "0x3D",
  "0x7A",
  "0x00",
  "0x11",
  "0x22",
  "0x33",
  "0x44",
  "0x55",
  "0x66",
  "0x77",
  "0x88",
  "0x99",
  "0xAA",
  "0xBB",
  "0xCC",
  "0xDD",
  "0xEE",
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="py-24 px-4 md:px-12 max-w-7xl mx-auto scroll-mt-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">
            03.
          </span>{" "}
          Featured Work
        </h2>
      </motion.div>

      <div className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* SpotlightCard now handles its own internal physics */}
          <SpotlightCard className="p-0 overflow-hidden group">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-20">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20">
                    <Database size={28} />
                  </div>
                  <div className="flex gap-4 text-slate-400">
                    <a
                      href={heroProject.github}
                      target="_blank"
                      className="hover:text-teal-400 transition-colors"
                    >
                      <Github size={22} />
                    </a>
                    <a
                      href={heroProject.link}
                      className="hover:text-teal-400 transition-colors"
                    >
                      <ExternalLink size={22} />
                    </a>
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-100 mb-4 tracking-tight group-hover:text-teal-400 transition-colors">
                  {heroProject.title}
                </h3>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8">
                  {heroProject.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {heroProject.tech.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono text-teal-400/90 bg-teal-400/10 px-3 py-1.5 rounded-md border border-teal-400/20 uppercase tracking-tighter"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-[45%] bg-[#080b11] border-t lg:border-t-0 lg:border-l border-slate-800 relative flex flex-col justify-center p-8">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
                <div className="relative z-10 w-full max-w-sm mx-auto">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                      <HardDrive size={14} className="text-purple-400" />
                      <span>Disk / Page_01</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                      </span>
                      <span className="text-[10px] text-teal-400 font-mono uppercase">
                        I/O Active
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#020408] border border-slate-800 rounded-xl p-4 shadow-inner">
                    <div className="grid grid-cols-6 gap-2">
                      {hexBytes.map((byte, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut",
                          }}
                          className={`aspect-square rounded text-[8px] md:text-[10px] font-mono flex items-center justify-center border transition-colors ${byte !== "0x00" ? "bg-purple-500/20 border-purple-500/30 text-purple-300" : "bg-slate-900 border-slate-800 text-slate-600"}`}
                        >
                          {byte}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="h-full"
            >
              <SpotlightCard className="p-8 h-full flex flex-col group">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-slate-800/50 rounded-xl text-teal-400 group-hover:text-white group-hover:bg-slate-700 transition-colors border border-white/5">
                    {project.title.includes("Chat") ? (
                      <Zap size={24} />
                    ) : (
                      <Folder size={24} />
                    )}
                  </div>
                  <div className="flex gap-4 text-slate-400 z-20">
                    <a
                      href={project.github}
                      target="_blank"
                      className="hover:text-teal-400 transition-colors"
                    >
                      <Github size={20} />
                    </a>
                    <a
                      href={project.link}
                      className="hover:text-teal-400 transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-100 mb-3 group-hover:text-teal-400 transition-colors tracking-tight">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-white/5">
                  {project.tech.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-white/5 uppercase tracking-tighter"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
