"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Github } from "lucide-react";
import CaseStudyPanel, { type CaseStudy } from "./CaseStudyPanel";
import { track } from "@/lib/track";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

// Facts mirror ~/assisstant/portfolio-in/FACTS.md and the résumé. Client names follow the
// portfolio rules: Max Estates is named (they agreed); the gate-pass institution is not.
type Work = CaseStudy & { status: string; context: string; stats?: { n: string; l: string }[] };

const maxEstates: Work = {
  title: "AI-CCTV security dashboard",
  status: "Live on site",
  context: "Max Estates · gated villa community, Dehradun · Sep 2026 – present",
  description:
    "An AI camera box across eight cameras was detecting intrusions, falls, animals and unattended posts, but nothing turned those detections into something a guard could act on at 3 am, or told management whether the patrol route was being walked.",
  tech: ["Node.js", "SQLite", "HTTP callbacks", "Excel / PDF export"],
  stats: [
    { n: "8 → 1", l: "cameras on one screen" },
    { n: "7", l: "alert types" },
    { n: "EN / HI", l: "voice alerts" },
    { n: "Sep 2026", l: "live since" },
  ],
  problem:
    "The detections existed; nobody could act on them. Guards needed one screen they could use half-asleep, and management needed to know whether the patrol route was actually walked.",
  approach: [
    "Built for guards, not engineers: one button to acknowledge, six seconds to undo a mis-tap, a wall-TV mode that shows ALL CLEAR or the number of alerts needing attention",
    "Patrol timers driven by the absence of detections, the question the cameras alone can't answer, with Excel, CSV and PDF reports",
    "Integrated through the camera box's own HTTP callback instead of its partner-only API: no NDA, no weeks of waiting",
    "Head office gets a view-only sign-in over the private network, enforced on the server",
  ],
  architecture:
    "AI box → HTTP callback → Node.js on the guard-room PC → SQLite → guard screen + reports. Installs from a desktop icon, starts on boot and checks itself.",
  outcome: [
    "Installed on the guard-room PC by me; in daily use by the guard team since September 2026",
    "Supported remotely since go-live",
    "Screenshots on this page use demonstration data, not residents' records",
  ],
};

const others: Work[] = [
  {
    title: "Document workflow platform",
    status: "Built · 2026",
    context: "Shipping-software company (client work)",
    description:
      "Classifies a shipment's paperwork, checks the documents against each other with rules the customer edits, and routes only the doubtful cases to a person, with an audit trail on every decision.",
    tech: ["Python", "FastAPI", "PostgreSQL", "Celery", "Docker"],
    stats: [
      { n: "412", l: "automated tests" },
      { n: "13", l: "document types in config" },
      { n: "0", l: "engine changes for a 2nd industry" },
    ],
    problem:
      "Customers receive shipping paperwork as PDFs, scans and spreadsheets, and someone has to check that the documents for one shipment agree with each other.",
    approach: [
      "Rules are configuration: 'bills of lading must sum to the manifest within 0.5%' is one line of YAML, not a deployment",
      "Documents missing a sibling go on hold and re-check themselves when it arrives",
      "Tenant isolation enforced by PostgreSQL row-level security, so a query that forgets to filter returns nothing",
      "AI is opt-in in two narrow lanes and never decides an outcome alone; every human override is recorded with a reason",
    ],
    architecture: "Ingest → classify → extract → validate (rules in config) → review only when needed → deliver.",
    outcome: [
      "When the client changed direction after the demo, a whole second domain (purchase orders, goods receipts, invoices and the 3-way match) was added in configuration alone",
      "412 automated tests",
    ],
  },
  {
    title: "Construction ERP modernisation",
    status: "Production · ~20 tenants",
    context: "ProjAuto · contract technical lead",
    description:
      "A decade-old Java monolith with no tests and a database in Singapore read from India, where the number of queries, not their complexity, decided whether a page loaded at all.",
    tech: ["Java 17", "Spring Boot", "React", "React Native"],
    stats: [
      { n: "711 / 1,100", l: "commits written by me" },
      { n: "0 → 1,435", l: "automated tests" },
      { n: "15.6s → 2.4s", l: "material reservations" },
    ],
    problem:
      "Pages took tens of seconds, tenants could reach each other's data, and nobody could change the code safely.",
    approach: [
      "Audited all 53 list screens before optimising anything: 39 made one database call per row, about 4,025 round trips per page load; fixed them in order of payoff",
      "User list 30 s → 2.5 s (~1,400 queries → 3), executive analytics ~25 s → ~3 s, material reservations 15.6 s → 2.4 s",
      "Closed cross-tenant access holes in eight services, removed three debug endpoints live in production, replaced a rate limiter that only worked on one server",
      "Built the CI/CD from nothing (six workflows; production deploys need a typed confirmation) and a phone app, alone, that turned a paper timesheet into a 30-second action",
    ],
    architecture: "Spring Boot 3 + React, multi-tenant, CI/CD with guarded production deploys; React Native field app.",
    outcome: [
      "631k → 156k lines after the migration; 0 → 1,435 automated tests",
      "Mentoring five developers on the team",
      "Traced repeated production crashes to a restart script killing the wrong process",
    ],
  },
  {
    title: "Visit-approval & QR gate-pass app",
    status: "In build · Oct 2026",
    context: "Residential institution, Dehradun",
    description:
      "Parents emailed to ask for visits, staff approved by email, and security checked IDs by hand at a gate whose QR readers and boom barrier had never been connected to any of it.",
    tech: ["Expo / React Native", "FastAPI", "SQLite", "QR"],
    problem:
      "QR readers and a boom barrier were installed a year earlier and never connected to anything; approvals lived in email.",
    approach: [
      "A parent sees only their own child: verified once on first install against the institution's records, then bound to that child",
      "Approvals follow the institution's hierarchy, with anything unclear escalating up the chain in the same app",
      "Designed for low-end Android phones and patchy data: one action per screen, Hindi first, the pass cached to show offline",
      "Data never leaves the campus; the existing SMS gateway and gate hardware are reused",
    ],
    architecture: "Parent app → request → staff approval chain → QR pass on the phone → gate reader → barrier opens, logged.",
    outcome: [
      "Prototype complete; integration with the institution's existing gate terminals is being checked first, before anything that depends on it",
    ],
  },
  {
    title: "PyDB: a database from scratch",
    status: "Open source",
    context: "Self-directed",
    description:
      "A transactional storage engine in pure Python: an 8 KB pager, clustered and secondary B-Tree indexes, and a write-ahead log with redo recovery and atomic checkpoints.",
    tech: ["Python", "B-Tree", "WAL", "pytest", "CI"],
    github: "https://github.com/AnirudhChandan/PyDB",
    problem:
      "I wanted to understand what a database does between a SQL statement and the disk, so instead of using one I built one.",
    approach: [
      "Fixed 8 KB pages owned by a single pager, the only component that touches the data files",
      "A clustered B-Tree (id → row) and a secondary B-Tree for O(log n) lookups",
      "Every insert is fsync'd to the write-ahead log before it counts as committed",
      "Checkpoints write a new file and rename it over the old one, so the data file is never half-written",
    ],
    architecture:
      "insert → WAL START (fsync) → change pages in memory → WAL COMMIT (fsync). On restart: redo every committed transaction since the last checkpoint, drop the rest.",
    outcome: [
      "Tests SIGKILL a writer mid-workload and mid-checkpoint; no acknowledged insert is lost",
      "The first version failed that test and lost every committed write; the fix is written up on the blog",
      "A TypeScript B+Tree built on the same ideas runs live in the Lab",
    ],
  },
  {
    title: "Nexus Chat",
    status: "Open source",
    context: "Self-directed",
    description:
      "A real-time chat backend where the socket layer never waits on the database: a queue decouples ingestion from persistence and read receipts batch through Redis.",
    tech: ["Node.js", "Socket.IO", "PostgreSQL", "Redis", "BullMQ", "WebRTC"],
    github: "https://github.com/AnirudhChandan/nexus-chat",
    problem: "Real-time chat has to stay responsive when write volume spikes or the database slows down.",
    approach: [
      "A BullMQ queue decouples message ingestion from database writes",
      "Read receipts collect in Redis and flush in 10-second batches",
      "Postgres range partitioning keeps message history fast",
      "WebRTC for 1:1 video, with the socket server doing signalling only",
    ],
    architecture: "Socket.IO gateway → BullMQ → worker → range-partitioned Postgres; receipts → Redis → batched flush.",
    outcome: ["~99% fewer read-receipt writes from batching", "The socket layer never blocks on the database"],
  },
];

function Stats({ stats, cols = "grid-cols-3" }: { stats?: Work["stats"]; cols?: string }) {
  if (!stats) return null;
  return (
    <div className={`grid ${cols} gap-2.5`}>
      {stats.map((s) => (
        <div key={s.l} className="rounded-lg border border-white/[0.07] bg-slate-950/40 px-3 py-2.5">
          <div className="font-display font-bold text-base md:text-lg text-slate-50 tracking-tight whitespace-nowrap">{s.n}</div>
          <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{s.l}</div>
        </div>
      ))}
    </div>
  );
}

function More({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-1.5 text-sm font-mono text-teal-400 hover:text-teal-300"
    >
      Read the case study <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

export default function Work() {
  const [active, setActive] = useState<CaseStudy | null>(null);
  const open = (w: CaseStudy) => {
    setActive(w);
    track("case_study_open", { title: w.title });
  };

  return (
    <section id="work" className="px-5 md:px-12 max-w-7xl mx-auto scroll-mt-28">
      <SectionHeader kicker="Selected work" title="Systems people rely on">
        Client systems in production, a platform built to outlive its first customer, and the
        self-directed projects where I learn what I rely on.
      </SectionHeader>

      {/* Featured: the one with screenshots */}
      <Reveal>
        <article className="rounded-3xl border border-white/[0.07] bg-slate-900/50 overflow-hidden">
          <div className="grid lg:grid-cols-5">
            <div className="lg:col-span-2 p-6 md:p-10 flex flex-col gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 text-[11px] font-mono text-teal-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> {maxEstates.status}
                  </span>
                  <span className="text-xs text-slate-500">{maxEstates.context}</span>
                </div>
                <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-50 tracking-tight mb-3">
                  {maxEstates.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{maxEstates.description}</p>
              </div>
              <Stats stats={maxEstates.stats} cols="grid-cols-2" />
              <More onClick={() => open(maxEstates)} />
            </div>
            <div className="lg:col-span-3 bg-slate-950/40 p-4 md:p-6 flex flex-col gap-4 justify-center">
              <figure>
                <Image
                  src="/work/max-estates-guard.jpg"
                  alt="Guard screen: alerts needing checking, each with one-tap 'real problem' or 'all fine' buttons"
                  width={1600}
                  height={1111}
                  className="rounded-xl border border-white/[0.07]"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                />
                <figcaption className="text-xs text-slate-500 mt-2">
                  The guard screen: one tap to check an alert, reasons in plain words, a Hindi toggle. Demo data.
                </figcaption>
              </figure>
              <figure className="hidden sm:block">
                <Image
                  src="/work/max-estates-patrol.jpg"
                  alt="Patrol compliance by checkpoint, day and night"
                  width={1600}
                  height={911}
                  className="rounded-xl border border-white/[0.07]"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                />
                <figcaption className="text-xs text-slate-500 mt-2">
                  Patrol compliance by checkpoint, the question the cameras alone couldn&apos;t answer. Demo data.
                </figcaption>
              </figure>
            </div>
          </div>
        </article>
      </Reveal>

      <div className="grid md:grid-cols-6 gap-4 md:gap-5 mt-5">
        {others.map((w, i) => (
          <Reveal key={w.title} delay={0.04 * i} className={`h-full ${i < 2 ? "md:col-span-3" : "md:col-span-2"}`}>
            <article className="h-full rounded-2xl border border-white/[0.07] bg-slate-900/50 p-6 md:p-8 flex flex-col gap-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-mono text-slate-300">
                    {w.status}
                  </span>
                  <span className="text-xs text-slate-500">{w.context}</span>
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-slate-50 tracking-tight mb-2">
                  {w.title}
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">{w.description}</p>
              </div>
              <Stats stats={w.stats} />
              <div className="flex flex-wrap gap-1.5">
                {w.tech.map((t) => (
                  <span key={t} className="text-[11px] font-mono text-slate-400 bg-white/[0.04] rounded px-2 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-5">
                <More onClick={() => open(w)} />
                {w.github && (
                  <a
                    href={w.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-mono text-slate-400 hover:text-slate-200"
                  >
                    <Github size={15} /> Code
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <CaseStudyPanel study={active} onClose={() => setActive(null)} />
    </section>
  );
}
