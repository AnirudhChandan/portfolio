"use client";

import { motion } from "framer-motion";
import { Calendar, Briefcase, ChevronRight, Zap } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

const experiences = [
  {
    company: "Docplix",
    role: "Lead Backend Architect (V2.0)",
    period: "Nov 2025 - Present",
    type: "Infrastructure",
    description:
      "Spearheading the migration from a monolithic legacy system to a decoupled, high-performance microservices architecture.",
    achievements: [
      "Architected 30+ RESTful endpoints ensuring 99.9% data consistency.",
      "Engineered a centralized sync service to resolve critical inventory mismatches.",
      "Optimized Sequelize query patterns for high-concurrency patient dashboards.",
    ],
    tech: ["Node.js", "Sequelize", "Microservices", "Redis"],
  },
  {
    company: "Genpact",
    role: "Software Engineer",
    period: "Apr 2024 - Oct 2025",
    type: "Data Engineering",
    description:
      "Promoted from intern to lead serverless pipeline development for tax computation software.",
    achievements: [
      "Designed serverless data pipelines (Python/GCP) boosting efficiency by 35%.",
      "Reduced API response times by 40% using Kafka event streams.",
      "Integrated LLM summarization for automated reporting.",
    ],
    tech: ["Python", "GCP", "Kafka", "Docker"],
  },
  {
    company: "Docplix",
    role: "Junior Software Engineer",
    period: "Jan 2020 - July 2024",
    type: "Product Engineering",
    description:
      "Early member of the engineering team focused on optimizing core health record systems.",
    achievements: [
      "Reduced patient record retrieval latency by 40% via advanced indexing.",
      "Built real-time analytics dashboard with React and interactive charts.",
    ],
    tech: ["React", "PostgreSQL", "SQL Optimization"],
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative"
    >
      {/* Background Section Number */}
      <div className="absolute top-10 right-10 text-[15rem] font-bold text-slate-800/10 select-none pointer-events-none">
        02
      </div>

      <div className="mb-20">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-6 flex items-center gap-4">
          <span className="text-teal-400 font-mono text-2xl">02.</span>{" "}
          Professional Path
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
          My career has been a journey through{" "}
          <span className="text-teal-400">system design</span>, from
          product-focused engineering to high-scale infrastructure architecture.
        </p>
      </div>

      <div className="relative">
        {/* The Central "Power Line" - Hidden on mobile, visible on desktop */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/50 via-slate-800 to-transparent hidden md:block"></div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center w-full ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
            >
              {/* 1. The Card Container */}
              <div className="w-full md:w-5/12">
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <SpotlightCard
                    className="p-6 md:p-8"
                    spotlightColor="rgba(45, 212, 191, 0.1)"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-[10px] font-mono rounded-full border border-teal-500/20 uppercase tracking-widest">
                        {exp.type}
                      </span>
                      <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px]">
                        <Calendar size={12} />
                        {exp.period}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">
                      {exp.role}
                    </h3>
                    <p className="text-teal-400 font-mono text-sm mb-6">
                      @ {exp.company}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {exp.achievements.map((ach, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-slate-400 text-sm"
                        >
                          <ChevronRight
                            size={14}
                            className="text-teal-500 mt-1 shrink-0"
                          />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                      {exp.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </SpotlightCard>
                </motion.div>
              </div>

              {/* 2. The Timeline Center Dot */}
              <div className="relative flex items-center justify-center w-full md:w-2/12 my-6 md:my-0">
                <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <Briefcase size={16} className="text-teal-400" />
                </div>
                {/* Glow effect for the dot */}
                <div className="absolute w-12 h-12 bg-teal-500/10 rounded-full blur-xl"></div>
              </div>

              {/* 3. Empty spacer for alignment */}
              <div className="hidden md:block w-5/12"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
