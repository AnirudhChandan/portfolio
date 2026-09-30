"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Folder, Database, HardDrive, Zap, ArrowRight, FileCheck } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import CaseStudyPanel, { type CaseStudy } from "./CaseStudyPanel";

const heroProject: CaseStudy = {
  title: "PyDB: Storage Engine",
  description:
    "A transactional storage engine in pure Python with zero dependencies: an 8 KB pager, clustered and secondary B-Tree indexes, and a write-ahead log with redo recovery and atomic checkpoints. Crash recovery is tested by killing a writer process with SIGKILL mid-workload.",
  tech: ["Python", "B-Tree", "Write-ahead log", "Crash recovery", "pytest", "CI"],
  github: "https://github.com/AnirudhChandan/PyDB",
  problem:
    "I wanted to understand what a database does between a SQL statement and the disk, so instead of using one I built one.",
  approach: [
    "Fixed 8 KB pages owned by a single pager — the only component that touches the data files",
    "A clustered B-Tree (id → row) and a secondary B-Tree (hash of email → id) for O(log n) lookups",
    "A write-ahead log: every insert is fsync'd to the log before it counts as committed",
    "Checkpoints write a new file and rename it over the old one, so the data file is never half-written",
  ],
  architecture:
    "insert → WAL START (fsync) → change pages in memory → WAL COMMIT (fsync). On restart: redo every committed transaction since the last checkpoint, drop the rest.",
  outcome: [
    "~0.20 ms indexed reads and ~2,650 durable inserts/sec on a laptop",
    "20 tests in CI, including SIGKILL mid-workload and mid-checkpoint — no acknowledged insert is ever lost",
    "The first version failed that test and lost every committed write; the fix is written up on the blog",
    "A separate TypeScript B+Tree built on the same ideas runs live in the Lab",
  ],
};

const otherProjects: CaseStudy[] = [
  {
    title: "Document Workflow Platform",
    description:
      "Client work: a multi-tenant platform that classifies incoming documents, checks them against customer-editable rules, and routes them through maker-checker review with a full audit trail.",
    tech: ["Python", "FastAPI", "PostgreSQL", "Celery"],
    problem:
      "Shipping operations run on documents that have to agree with each other — weights on a bill of lading against the manifest, crew lists, dates across forms — and checking that by eye doesn't scale.",
    approach: [
      "Layered classification that refuses to guess: unclear documents go to a human",
      "Validation rules in YAML that the customer edits themselves, including cross-document checks",
      "Maker-checker review with recorded overrides; every version immutable, every check traced",
      "Tenant isolation enforced by PostgreSQL row-level security, not just application code",
    ],
    architecture:
      "Upload → classify → extract → validate (YAML rules) → review queue → immutable version + audit event. Celery workers, Postgres with RLS.",
    outcome: [
      "400+ automated tests",
      "A second industry pack (procure-to-pay, 3-way match) ran with zero engine changes",
    ],
  },
  {
    title: "Nexus Chat",
    description:
      "A real-time chat backend built so the socket layer never waits on the database: BullMQ decouples ingestion from persistence, read receipts batch through Redis, and Postgres range partitioning keeps history fast. 1:1 video over WebRTC.",
    tech: ["Node.js", "Socket.IO", "PostgreSQL", "Redis", "BullMQ", "WebRTC"],
    github: "https://github.com/AnirudhChandan/nexus-chat",
    problem: "Real-time chat has to stay responsive even when write volume spikes or the database slows down.",
    approach: [
      "A BullMQ queue decouples message ingestion from database writes",
      "Read receipts are collected in Redis and flushed in 10-second batches",
      "Postgres range partitioning on messages keeps historical reads scalable",
      "WebRTC for 1:1 video, with the socket server doing signalling",
    ],
    architecture:
      "Socket.IO gateway → BullMQ → worker → range-partitioned Postgres; receipts → Redis → batched flush.",
    outcome: [
      "~99% fewer read-receipt writes from batching",
      "The socket layer never blocks on the database",
      "Historical reads stay fast as the messages table grows",
    ],
  },
  {
    title: "ProjAuto",
    description:
      "Top contributor (180+ commits) on a multi-tenant SaaS ERP with 20+ live tenants and 120+ services. Eliminated N+1 queries across 53 endpoints (15.6s → 2.4s), built a distributed token-bucket rate limiter, and closed account-takeover and cross-tenant IDOR holes.",
    tech: ["Java", "Spring Boot", "React", "Redis"],
    problem:
      "A multi-tenant ERP migrated from a legacy Java monolith had slow, N+1-heavy endpoints and tenant-isolation gaps.",
    approach: [
      "Migrated the legacy monolith to Spring Boot + React",
      "Profiled and eliminated N+1 queries across 53 endpoints",
      "Added a distributed token-bucket rate limiter",
      "Found and closed account-takeover and cross-tenant IDOR vulnerabilities",
    ],
    architecture: "React + Spring Boot, multi-tenant, rate-limited, Redis-backed.",
    outcome: [
      "15.6s → 2.4s on the worst endpoints",
      "180+ commits as the top contributor",
      "Tenants can no longer read each other's records by changing an id",
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
          <span className="text-teal-400 font-display font-black text-2xl">02.</span> Featured Work
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
                      <span className="text-[10px] text-teal-400 font-mono uppercase">8 KB pages</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    ) : project.title.includes("Document") ? (
                      <FileCheck size={24} />
                    ) : (
                      <Folder size={24} />
                    )}
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
