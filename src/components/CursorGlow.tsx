"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const GLOW = 320; // px

// A soft glow that trails the cursor. On touch devices there's no mousemove, so
// it simply stays parked off-screen (invisible). Hidden entirely for users who
// prefer reduced motion. Never intercepts clicks.
export default function CursorGlow() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-GLOW);
  const y = useMotionValue(-GLOW);
  const sx = useSpring(x, { stiffness: 150, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 150, damping: 20, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX - GLOW / 2);
      y.set(e.clientY - GLOW / 2);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [reduce, x, y]);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: sx,
        y: sy,
        width: GLOW,
        height: GLOW,
        background: "radial-gradient(circle, rgba(45,212,191,0.10), transparent 62%)",
      }}
      className="pointer-events-none fixed left-0 top-0 z-[45] rounded-full mix-blend-screen"
    />
  );
}
