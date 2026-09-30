"use client";

import { motion } from "framer-motion";
import { Briefcase, ChevronRight } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

// Mirrors the résumé (resume-src/resume_master.html). Change both together.
const experiences = [
  {
    company: "Independent — contract work",
    role: "Backend / Full-Stack Engineer",
    period: "Aug 2026 - Present",
    type: "Freelance",
    description:
      "Contract engagements for two clients: a document-workflow platform for a shipping-management company, and an operations dashboard for an on-site AI CCTV deployment.",
    achievements: [
      "Built a multi-tenant document-workflow platform (FastAPI, PostgreSQL row-level security, Celery): layered document classification, customer-editable YAML validation rules, maker-checker review, immutable versions and a per-check audit trail, with 400+ automated tests.",
      "Designed it as a platform rather than a one-off: a second industry pack (procure-to-pay, with 3-way matching) ran on the same engine with zero engine changes.",
      "Shipped a Node.js dashboard that ingests events from an on-prem AI vision box over HTTP callbacks, runs patrol and absent-from-post timers, and produces Excel/PDF reports — installed on site and in production since Sep 2026.",
    ],
    tech: ["Python", "FastAPI", "PostgreSQL", "Celery", "Node.js", "SQLite"],
  },
  {
    company: "Docplix",
    role: "Software Engineer",
    period: "Nov 2025 - Present",
    type: "Healthcare",
    description:
      "Backend for an EHR platform used by 4,000+ clinics, as one of four engineers.",
    achievements: [
      "Built and led 30+ Node.js/Sequelize REST APIs and ran a zero-downtime v1→v2 migration with 100% data integrity.",
      "Designed optimistic concurrency control and distributed Redis locks for the central sync service, eliminating the race conditions behind concurrent-write data mismatches.",
      "Replaced legacy polling with push notifications (WebSockets + Redis Pub/Sub), cutting backend traffic by 80%.",
    ],
    tech: ["Node.js", "Sequelize", "PostgreSQL", "Redis", "WebSockets"],
  },
  {
    company: "Genpact",
    role: "Software Engineer (promoted from Intern)",
    period: "Feb 2024 - Oct 2025",
    type: "Data Engineering",
    description:
      "Joined as an intern and was promoted to software engineer, working on serverless data pipelines for tax computation software.",
    achievements: [
      "Engineered idempotent, exactly-once processing for a Kafka tax-ingestion pipeline using database constraints, guaranteeing correctness across partitions during network failures.",
      "Built resilient Python (Flask) microservices with automated retries and dead-letter queues, serving 24 modules with zero data loss.",
      "Integrated structured logging and distributed tracing across serverless GCP Cloud Functions, cutting MTTR for critical production bugs by 40%.",
    ],
    tech: ["Python", "Flask", "Kafka", "GCP", "Docker"],
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-24 px-4 md:px-12 max-w-7xl mx-auto relative scroll-mt-32"
    >
      {/* Huge background number using font-display (Hidden on mobile to save space) */}
      <div className="absolute top-10 right-10 text-[15rem] font-black font-display text-slate-800/20 select-none pointer-events-none tracking-tighter hidden md:block">
        01
      </div>

      {/* Header Container - Aligned to match the new text column offset */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-20 md:ml-24"
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">
            01.
          </span>{" "}
          Experience
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
          Data pipelines at Genpact, a healthcare backend at Docplix, and contract work
          building <span className="text-teal-400">platforms that have to be right</span>:
          audit trails, migrations on live data, exactly-once processing.
        </p>
      </motion.div>

      <div className="relative">
        {/* THE MASTER TIMELINE LINE */}
        {/* Fades in at the top and out at the bottom for elegance */}
        <div className="absolute top-0 bottom-0 left-0 w-12 md:w-24 flex justify-center z-0">
          <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        </div>

        <div className="space-y-16 md:space-y-24">
          {experiences.map((exp, index) => (
            <div key={index} className="relative group">
              {/* TIMELINE NODE / DOT */}
              {/* Perfectly centered on the master line */}
              <div className="absolute left-0 w-12 md:w-24 flex justify-center top-2 z-20">
                <div className="w-4 h-4 rounded-full bg-slate-950 border-2 border-slate-700 group-hover:border-teal-400 group-hover:bg-teal-500/20 transition-all duration-500">
                  {/* Bouncing ping effect triggers when the user hovers anywhere over this experience block */}
                  <div className="absolute inset-0 rounded-full bg-teal-400 opacity-0 group-hover:animate-ping group-hover:opacity-40" />
                </div>
              </div>

              <div className="ml-12 md:ml-24 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
                {/* LEFT COLUMN: Sticky Header */}
                <div className="md:col-span-5 lg:col-span-4 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    // STICKY MAGIC HAPPENS HERE
                    // The text stays locked while the tall right-side card scrolls past
                    className="md:sticky md:top-32 pt-1"
                  >
                    <span className="text-teal-400 font-mono text-xs md:text-sm block mb-3">
                      {exp.period}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-100 mb-2 tracking-tight">
                      {exp.role}
                    </h3>
                    <p className="text-slate-400 font-mono text-sm mb-6 flex items-center gap-2">
                      <Briefcase size={14} className="text-slate-500" />
                      {exp.company}
                    </p>
                    <span className="inline-block px-3 py-1 bg-slate-800/50 text-slate-300 text-[10px] font-mono rounded-full border border-white/5 uppercase tracking-widest">
                      {exp.type}
                    </span>
                  </motion.div>
                </div>

                {/* RIGHT COLUMN: Scrolling Body */}
                <div className="md:col-span-7 lg:col-span-8 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <SpotlightCard className="p-6 md:p-8">
                      <p className="text-slate-300 text-base leading-relaxed mb-6">
                        {exp.description}
                      </p>
                      <ul className="space-y-4 mb-8">
                        {exp.achievements.map((ach, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-slate-400 text-sm md:text-base leading-relaxed"
                          >
                            <ChevronRight
                              size={18}
                              className="text-teal-500 mt-0.5 shrink-0"
                            />
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                        {exp.tech.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono text-teal-400/80 bg-teal-400/10 px-2 py-1 rounded border border-teal-400/20 uppercase tracking-tighter"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </SpotlightCard>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
