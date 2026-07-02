"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Github, Target, Wrench, GitBranch, TrendingUp } from "lucide-react";

export interface CaseStudy {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  problem: string;
  approach: string[];
  architecture: string;
  outcome: string[];
}

export default function CaseStudyPanel({
  study,
  onClose,
}: {
  study: CaseStudy | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {study && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${study.title} case study`}
            className="fixed top-0 right-0 bottom-0 z-[151] w-full max-w-xl bg-[#0b0f15] border-l border-white/10 overflow-y-auto custom-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0b0f15]/90 backdrop-blur-md border-b border-white/5 px-6 md:px-8 py-5 flex items-start justify-between gap-4 z-10">
              <div>
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest">
                  Case Study
                </span>
                <h3 className="text-2xl font-display font-bold text-slate-100 tracking-tight mt-1">
                  {study.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {study.github && (
                  <a
                    href={study.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View source on GitHub"
                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    <Github size={18} />
                  </a>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close case study"
                  className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-6 md:px-8 py-8 space-y-10">
              <p className="text-slate-300 leading-relaxed">{study.description}</p>

              <Block icon={<Target size={16} />} title="The problem">
                <p className="text-slate-400 leading-relaxed">{study.problem}</p>
              </Block>

              <Block icon={<Wrench size={16} />} title="The approach">
                <ul className="space-y-2">
                  {study.approach.map((a, i) => (
                    <li key={i} className="flex gap-3 text-slate-400 leading-relaxed">
                      <span className="text-teal-500 shrink-0 mt-1">▸</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </Block>

              <Block icon={<GitBranch size={16} />} title="Architecture">
                <p className="font-mono text-sm text-teal-300/90 bg-slate-900/60 border border-white/5 rounded-lg p-4 leading-relaxed">
                  {study.architecture}
                </p>
              </Block>

              <Block icon={<TrendingUp size={16} />} title="Outcome">
                <ul className="space-y-2">
                  {study.outcome.map((o, i) => (
                    <li key={i} className="flex gap-3 text-slate-300 leading-relaxed">
                      <span className="text-emerald-400 shrink-0 mt-1">✓</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </Block>

              <div className="flex flex-wrap gap-2 pt-2">
                {study.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono text-teal-400/90 bg-teal-400/10 px-2.5 py-1 rounded border border-teal-400/20 uppercase tracking-tighter"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Block({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 text-slate-200 font-bold text-sm">
        <span className="text-teal-400">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}
