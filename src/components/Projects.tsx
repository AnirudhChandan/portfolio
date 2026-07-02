"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Folder, Database, HardDrive, Zap, ArrowRight } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import CaseStudyPanel, { type CaseStudy } from "./CaseStudyPanel";

const heroProject: CaseStudy = {
  title: "PyDB: Storage Engine",
  description:
    "A disk-based relational B-Tree storage engine implemented in Python. Features a custom Disk Pager, WAL for ACID compliance, and raw binary serialization using struct packing. Engineered for high-throughput reads/writes with strict O(log n) performance.",
  tech: ["Python", "B-Tree", "Binary Serialization", "File I/O", "ACID"],
  github: "https://github.com/AnirudhChandan/PyDB",
  problem:
    "I wanted to understand database internals deeply — so instead of using a database, I built one from scratch.",
  approach: [
    "Fixed-size paging with a disk pager that manages raw bytes",
    "A B-Tree index for O(log n) point and range reads",
    "A Write-Ahead Log (log-before-apply) for crash recovery and ACID guarantees",
  ],
  architecture:
    "Pager → B-Tree → WAL. Every mutation is written to the log before the page changes, so a crash can always be replayed to a consistent state.",
  outcome: [
    "0.29ms reads on the disk-backed B-Tree",
    "ACID-compliant crash recovery via the WAL",
    "Ported to TypeScript — it now runs live in this browser (see the Storage Engine section above)",
  ],
};

const otherProjects: CaseStudy[] = [
  {
    title: "Nexus Chat",
    description:
      "A scalable real-time backend applying HLD/LLD for high throughput: a BullMQ queue decouples ingestion from DB writes, a write-behind cache cuts writes by 99%, and Postgres range partitioning enables scalable historical reads.",
    tech: ["Node.js", "PostgreSQL", "Redis", "BullMQ"],
    github: "https://github.com/AnirudhChandan/chat-app-v2",
    problem: "Real-time chat needs to stay fast even when write volume spikes.",
    approach: [
      "A BullMQ queue decouples message ingestion from database writes",
      "A write-behind cache absorbs bursts and batches writes",
      "Postgres range partitioning keeps historical reads scalable",
    ],
    architecture:
      "Producer → BullMQ → worker → write-behind cache → range-partitioned Postgres.",
    outcome: [
      "99% fewer database writes via the write-behind cache",
      "Scalable historical reads through range partitioning",
      "Ingestion stays healthy even when the database slows down",
    ],
  },
  {
    title: "ProjAuto",
    description:
      "Top contributor (180+ commits, full-stack) on a multi-tenant platform of 120+ services and 220+ entities. Eliminated N+1 queries across 53 endpoints (15.6s → 2.4s) and added a distributed token-bucket rate limiter, Redis caching, and multi-tenant RBAC.",
    tech: ["React", "Java", "Spring Boot", "Redis"],
    problem:
      "A multi-tenant platform (120+ services, 220+ entities) had slow, N+1-heavy endpoints.",
    approach: [
      "Profiled and eliminated N+1 queries across 53 endpoints",
      "Added a distributed token-bucket rate limiter at the gateway",
      "Introduced Redis caching and multi-tenant RBAC",
    ],
    architecture: "React + Spring Boot, multi-tenant, Redis-cached, rate-limited at the gateway.",
    outcome: [
      "15.6s → 2.4s on the worst hot endpoints",
      "180+ commits as the top contributor",
      "Consistent per-tenant isolation via RBAC",
    ],
  },
];

const hexBytes = [
  "0x00", "0x1A", "0x2F", "0xFF", "0x4C", "0x8B", "0x9E", "0x3D",
  "0x7A", "0x00", "0x11", "0x22", "0x33", "0x44", "0x55", "0x66",
  "0x77", "0x88", "0x99", "0xAA", "0xBB", "0xCC", "0xDD", "0xEE",
];

function CaseStudyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group/btn inline-flex items-center gap-1.5 text-sm font-mono text-teal-400 hover:text-teal-300 transition-colors"
    >
      Read case study
      <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
    </button>
  );
}

export default function Projects() {
  const [active, setActive] = useState<CaseStudy | null>(null);

  return (
    <section id="projects" className="py-24 px-4 md:px-12 max-w-7xl mx-auto scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">03.</span> Featured Work
        </h2>
      </motion.div>

      <div className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SpotlightCard className="p-0 overflow-hidden group">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-20">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20">
                    <Database size={28} />
                  </div>
                  <a
                    href={heroProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="PyDB source on GitHub"
                    className="text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    <Github size={22} />
                  </a>
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-100 mb-4 tracking-tight group-hover:text-teal-400 transition-colors">
                  {heroProject.title}
                </h3>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-6">
                  {heroProject.description}
                </p>
                <div className="mb-8">
                  <CaseStudyButton onClick={() => setActive(heroProject)} />
                </div>
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
                      <span className="text-[10px] text-teal-400 font-mono uppercase">I/O Active</span>
                    </div>
                  </div>
                  <div className="bg-[#020408] border border-slate-800 rounded-xl p-4 shadow-inner">
                    <div className="grid grid-cols-6 gap-2">
                      {hexBytes.map((byte, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
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
                    {project.title.includes("Chat") ? <Zap size={24} /> : <Folder size={24} />}
                  </div>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} source on GitHub`}
                      className="text-slate-400 hover:text-teal-400 transition-colors z-20"
                    >
                      <Github size={20} />
                    </a>
                  )}
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-100 mb-3 group-hover:text-teal-400 transition-colors tracking-tight">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>
                <div className="mb-6">
                  <CaseStudyButton onClick={() => setActive(project)} />
                </div>
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

      <CaseStudyPanel study={active} onClose={() => setActive(null)} />
    </section>
  );
}
