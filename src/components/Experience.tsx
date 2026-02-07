"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import SpotlightCard from "./SpotlightCard"; // <--- Import

const experiences = [
  {
    company: "Docplix",
    role: "Software Engineer",
    period: "Nov 2025 - Present",
    description:
      "Returned to lead backend architecture for the V2.0 migration.",
    achievements: [
      "Architected and deployed 30+ RESTful API endpoints using Node.js & Sequelize.",
      "Ensured 99.9% data consistency during critical inventory migration.",
      "Resolved critical inventory mismatches using a centralized sync service.",
    ],
    tech: ["Node.js", "Sequelize", "React"],
  },
  {
    company: "Genpact",
    role: "Software Engineer",
    period: "Apr 2024 - Oct 2025",
    description:
      "Promoted from Intern. Built serverless pipelines and high-throughput data systems.",
    achievements: [
      "Designed serverless data pipelines (Python/GCP), boosting efficiency by 35%.",
      "Reduced API response times by 40% using Kafka and Redis caching.",
      "Integrated GPT-3.5 for automated report summarization.",
    ],
    tech: ["Python", "GCP", "Kafka", "Redis"],
  },
  {
    company: "Docplix",
    role: "Software Engineer",
    period: "Jan 2020 - July 2024",
    description:
      "Early core team member focused on optimizing patient record retrieval.",
    achievements: [
      "Reduced patient record retrieval latency by 40% via advanced Sequelize indexing.",
      "Engineered Real-time Analytics Dashboard using React and Sparkline charts.",
    ],
    tech: ["React", "PostgreSQL", "Optimization"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-16 flex items-center gap-4">
          <span className="text-teal-400">02.</span> Experience
        </h2>

        <div className="flex flex-col gap-8">
          {experiences.map((exp, index) => (
            // Wrapping each experience in a SpotlightCard
            <SpotlightCard
              key={index}
              className="p-8 md:p-10"
              spotlightColor="rgba(255, 255, 255, 0.05)"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-100">
                    {exp.role}{" "}
                    <span className="text-teal-400">@ {exp.company}</span>
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-mono text-sm bg-slate-800/50 px-3 py-1 rounded-full w-fit">
                  <Calendar size={14} />
                  {exp.period}
                </div>
              </div>

              <p className="text-slate-300 mb-6 text-lg">{exp.description}</p>

              <ul className="space-y-3 mb-8">
                {exp.achievements.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-slate-400 text-sm md:text-base"
                  >
                    <span className="text-teal-400 mt-1.5 text-xs">▹</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                {exp.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full font-mono border border-slate-700 hover:text-teal-400 hover:border-teal-400/50 transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
