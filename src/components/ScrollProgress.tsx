"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Thin gradient progress bar pinned to the top of the viewport.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] bg-gradient-to-r from-teal-400 via-teal-300 to-purple-400 shadow-[0_0_12px_rgba(45,212,191,0.5)]"
    />
  );
}
