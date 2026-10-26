"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Github, Link2 } from "lucide-react";
import CaseStudyBody from "./CaseStudyBody";
import { toast } from "./Toaster";
import type { CaseStudy } from "@/lib/work";

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
            className="fixed top-0 right-0 bottom-0 z-[151] w-full max-w-xl bg-slate-900 border-l border-white/10 overflow-y-auto custom-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md border-b border-white/5 px-6 md:px-8 py-5 flex items-start justify-between gap-4 z-10">
              <div>
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest">
                  Case Study
                </span>
                <h3 className="text-2xl font-display font-bold text-slate-100 tracking-tight mt-1">
                  {study.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyLink(study.slug)}
                  aria-label="Copy a link to this case study"
                  title="Copy link"
                  className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-teal-400 transition-colors"
                >
                  <Link2 size={18} />
                </button>
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

            <div className="px-6 md:px-8 py-8">
              <CaseStudyBody study={study} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// Every case study also has its own page, so a link can be sent to someone.
function copyLink(slug: string) {
  const url = `${window.location.origin}/work/${slug}`;
  navigator.clipboard.writeText(url).then(
    () => toast.success("Link copied"),
    () => toast.info(url),
  );
}
