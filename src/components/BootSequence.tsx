"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LINES = [
  "$ initializing anirudh.dev …",
  "→ mounting /portfolio",
  "→ loading pydb storage engine … ok",
  "→ warming edge cache … ok",
  "→ establishing secure uplink … ok",
  "✓ system online",
];

// One-time, skippable terminal boot overlay. Shows once per browser session and
// never for users who prefer reduced motion.
export default function BootSequence() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(0);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem("booted", "1");
    } catch {
      /* ignore */
    }
    document.body.style.overflow = "";
    setVisible(false);
  }, []);

  useEffect(() => {
    if (reduce) return;
    let already = false;
    try {
      already = sessionStorage.getItem("booted") === "1";
    } catch {
      already = false;
    }
    if (already) return;

    let intervalId: ReturnType<typeof setInterval> | undefined;
    // Defer the reveal out of the effect body (one frame) so we never call
    // setState synchronously during the effect.
    const rafId = requestAnimationFrame(() => {
      setVisible(true);
      document.body.style.overflow = "hidden";
      let i = 0;
      intervalId = setInterval(() => {
        i += 1;
        setShown(i);
        if (i >= LINES.length) {
          clearInterval(intervalId);
          window.setTimeout(finish, 400);
        }
      }, 190);
    });
    return () => {
      cancelAnimationFrame(rafId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [reduce, finish]);

  useEffect(() => {
    if (!visible) return;
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [visible, finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[300] bg-slate-950 flex items-center justify-center font-mono text-sm cursor-pointer"
        >
          <div className="w-full max-w-md px-6">
            {LINES.slice(0, shown).map((l, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className={l.startsWith("✓") ? "text-teal-400 font-bold" : "text-slate-400"}
              >
                {l}
              </motion.div>
            ))}
            <div className="mt-5 text-[10px] text-slate-600 uppercase tracking-widest">
              press any key to skip
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
