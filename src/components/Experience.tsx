"use client";

import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

// Mirrors the résumé (resume-src/resume_master.html). Change both together.
const experiences = [
  {
    company: "Independent — contract work",
    role: "Backend / Full-Stack Engineer",
    period: "Aug 2026 - Present",
    type: "Freelance",
    description:
      "Contract work for businesses in India and abroad: a document-workflow platform for a shipping-software company, a live AI-CCTV dashboard for a gated community, and client websites.",
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
      "Backend for an EHR platform used by 2,300+ clinics, as one of four engineers.",
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
    <section id="experience" className="px-5 md:px-12 max-w-7xl mx-auto scroll-mt-28">
      <SectionHeader kicker="Hiring?" title="Experience">
        2.5+ years building backends that have to be right: data pipelines at Genpact, a healthcare platform
        at Docplix, and contract work with audit trails, live migrations and exactly-once processing.{" "}
        <a href="/ANIRUDH_CHANDAN_RESUME_2026.pdf" target="_blank" className="text-teal-400 hover:text-teal-300 whitespace-nowrap">
          Download the résumé →
        </a>
      </SectionHeader>

      <ol className="relative border-l border-white/10 ml-1.5 space-y-12">
        {experiences.map((exp) => (
          <li key={exp.company} className="pl-8 md:pl-10 relative">
            <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-teal-400 ring-4 ring-slate-950" />
            <Reveal>
              <div className="grid md:grid-cols-12 gap-4 md:gap-10">
                <div className="md:col-span-4">
                  <div className="font-mono text-xs text-teal-400 mb-2">{exp.period}</div>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-slate-50 tracking-tight">{exp.role}</h3>
                  <div className="text-slate-400 mt-1">{exp.company}</div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mt-2">{exp.type}</div>
                </div>
                <div className="md:col-span-8 rounded-2xl border border-white/[0.07] bg-slate-900/50 p-6 md:p-7">
                  <p className="text-slate-300 leading-relaxed mb-5">{exp.description}</p>
                  <ul className="space-y-3 mb-6">
                    {exp.achievements.map((a) => (
                      <li key={a} className="flex gap-3 text-sm md:text-[15px] text-slate-400 leading-relaxed">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal-400" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tech.map((t) => (
                      <span key={t} className="text-[11px] font-mono text-slate-400 bg-white/[0.04] rounded px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
