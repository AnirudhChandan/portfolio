"use client";

import { motion } from "framer-motion";
import { Briefcase, ChevronRight } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

const experiences = [
  {
    company: "Docplix",
    role: "Software Engineer",
    period: "Nov 2025 - Present",
    type: "Infrastructure",
    description:
      "Leading backend design for the migration from a monolithic legacy system to a decoupled, high-performance microservices architecture.",
    achievements: [
      "Led design & delivery of 30+ scalable REST APIs with a zero-downtime migration and 100% data integrity.",
      "Architected a push-based event system (WebSockets + Redis Pub/Sub), cutting backend traffic by 80%.",
      "Applied optimistic concurrency control and distributed Redis locks to eliminate race conditions across services.",
      "Reduced record-retrieval latency by 40% via indexing and SQL execution-plan optimization.",
    ],
    tech: ["Node.js", "WebSockets", "Redis", "Microservices"],
  },
  {
    company: "Genpact",
    role: "Software Engineer",
    period: "Feb 2024 - Oct 2025",
    type: "Data Engineering",
    description:
      "Promoted from intern to lead serverless pipeline development for tax computation software.",
    achievements: [
      "Engineered an idempotent Kafka ingestion pipeline guaranteeing exactly-once processing across distributed partitions.",
      "Built resilient Python (Flask) microservices with automated retries and Dead Letter Queues, serving 24 modules with zero data loss.",
      "Integrated structured logging and distributed tracing across serverless GCP services, cutting production MTTR by 40%.",
    ],
    tech: ["Python", "GCP", "Kafka", "Docker"],
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
        02
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
            02.
          </span>{" "}
          Professional Path
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
          My career has been a journey through{" "}
          <span className="text-teal-400">system design</span>, from
          data engineering to high-scale infrastructure architecture.
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
