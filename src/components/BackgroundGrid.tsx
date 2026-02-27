"use client";

import { motion } from "framer-motion";
import { useSyncExternalStore } from "react";

// --- COMPILER COMPLIANT HYDRATION FIX ---
// This safely detects if we are on the client side without triggering cascading setState errors
const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // Client snapshot
    () => false, // Server snapshot
  );
}

export default function BackgroundGrid() {
  const mounted = useIsMounted();

  // If we are rendering on the server, return a flat black background to prevent hydration mismatches
  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[-1] bg-slate-950 pointer-events-none"></div>
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-slate-950">
      {/* Base anchor gradient. 
        Keeps the center slightly lighter and the extreme edges pitch black to frame the content.
      */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950"></div>

      {/* 1. Purple/Blue Blob (Top Left) 
        Hardware accelerated via framer-motion transforms
      */}
      <motion.div
        animate={{
          x: ["0%", "10%", "0%"],
          y: ["0%", "10%", "0%"],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-purple-600/15 rounded-full blur-[120px] will-change-transform"
      />

      {/* 2. Vibrant Teal Blob (Center Right) 
        Moves in counter-phase to the purple blob to create an interlocking fluid effect
      */}
      <motion.div
        animate={{
          x: ["0%", "-15%", "0%"],
          y: ["0%", "15%", "0%"],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-teal-500/15 rounded-full blur-[120px] will-change-transform"
      />

      {/* 3. Dark Blue Deep Anchor (Bottom Center) 
        Provides a heavy base color so the bottom of the page doesn't feel empty
      */}
      <motion.div
        animate={{
          x: ["0%", "20%", "0%"],
          y: ["0%", "-10%", "0%"],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vw] max-w-[1000px] max-h-[1000px] bg-blue-600/15 rounded-full blur-[150px] will-change-transform"
      />
    </div>
  );
}
