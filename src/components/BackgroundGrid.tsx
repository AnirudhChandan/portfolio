"use client";

import { motion } from "framer-motion";

export default function BackgroundGrid() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      {/* 1. The Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* 2. The Radial Mask (Vignette) */}
      {/* This creates the "fade to black" effect at the edges so the grid isn't overwhelming */}
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-teal-400 opacity-20 blur-[100px]"></div>

      {/* 3. The "Beam" Animation */}
      {/* A subtle light that travels down the screen to simulate data flow */}
      <motion.div
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2,
        }}
        className="absolute left-1/2 w-[1px] h-[200px] bg-gradient-to-b from-transparent via-teal-400 to-transparent opacity-30 shadow-[0_0_20px_2px_rgba(45,212,191,0.3)]"
      />
    </div>
  );
}
