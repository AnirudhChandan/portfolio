"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  MoveHorizontal,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const legacyCode = `// ❌ THE PROBLEM: N+1 Query Issue
// Fetching all users first...
const users = await User.findAll();
const results = [];

// ...then looping triggers a DB query 
// for EACH user (Bad Performance)
for (const user of users) {
  const posts = await Post.findAll({
    where: { userId: user.id }
  });
  
  results.push({ 
    name: user.name, 
    posts: posts 
  });
}`;

const optimizedCode = `// ✅ THE FIX: Eager Loading & Projection
// Fetch everything in ONE optimized query
const users = await User.findAll({
  // Use JOIN to fetch related data
  include: [{
    model: Post,
    // Projection: Select only what we need
    attributes: ['title', 'content'] 
  }],
  // Index-optimized selection
  attributes: ['id', 'name', 'email'],
  limit: 100
});`;

// Simple syntax highlighter for the demo
const HighlightedCode = ({
  code,
  type,
}: {
  code: string;
  type: "bad" | "good";
}) => {
  return (
    <pre className="font-mono text-xs md:text-sm leading-6">
      {code.split("\n").map((line, i) => (
        <div key={i} className="table-row">
          <span className="table-cell select-none text-slate-700 text-right pr-4 w-8">
            {i + 1}
          </span>
          <span className="table-cell">
            {line.split(" ").map((token, j) => {
              // Simple coloring logic
              let color = "text-slate-300";
              if (token.startsWith("//"))
                return (
                  <span
                    key={j}
                    className={
                      type === "bad" ? "text-red-400/70" : "text-emerald-400/70"
                    }
                  >
                    {line}
                  </span>
                );
              if (["const", "await", "for", "if", "return"].includes(token))
                color = "text-purple-400";
              if (
                ["User", "Post", "console"].includes(token.replace(/\./g, ""))
              )
                color = "text-yellow-400";
              if (token.includes("findAll") || token.includes("push"))
                color = "text-blue-400";
              if (token.includes("{") || token.includes("}"))
                color = "text-slate-500";

              return (
                <span key={j} className={`${color} mr-1.5`}>
                  {token}
                </span>
              );
            })}
          </span>
        </div>
      ))}
    </pre>
  );
};

export default function CodeComparison() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;

    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  // Global event listeners for smooth dragging outside the container
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    } else {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-6 flex items-center gap-4">
          <span className="text-teal-400">07.</span> Code Optimization
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg">
          I do not just write code; I{" "}
          <span className="text-teal-400">optimize</span> it. Drag the slider to
          see how I refactored a legacy N+1 query problem into a scalable
          solution.
        </p>
      </div>

      <div
        className="relative w-full max-w-4xl mx-auto h-[450px] md:h-[400px] select-none rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-[#0d1117]"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        {/* RIGHT SIDE (OPTIMIZED CODE - Background Layer) */}
        <div className="absolute inset-0 bg-[#0d1117] p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 size={18} />
              <span className="font-bold text-sm tracking-wider uppercase">
                Optimized V2.0
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono">1 DB Query</span>
          </div>
          <HighlightedCode code={optimizedCode} type="good" />
        </div>

        {/* LEFT SIDE (LEGACY CODE - Foreground Layer) */}
        <div
          className="absolute inset-0 bg-[#161b22] overflow-hidden border-r border-teal-400/50"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="w-full max-w-4xl p-6 md:p-8 whitespace-nowrap">
            <div className="flex items-center justify-between mb-4 w-[800px]">
              {" "}
              {/* Fixed width to prevent wrapping during clip */}
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle size={18} />
                <span className="font-bold text-sm tracking-wider uppercase">
                  Legacy Code
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                N+1 Query Problem
              </span>
            </div>
            <HighlightedCode code={legacyCode} type="bad" />
          </div>
        </div>

        {/* SLIDER HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-teal-400 cursor-ew-resize z-10 flex items-center justify-center hover:shadow-[0_0_15px_rgba(45,212,191,0.6)] transition-shadow"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center shadow-lg transform -translate-x-0.5">
            <MoveHorizontal size={16} className="text-slate-900" />
          </div>
        </div>

        {/* Instruction Overlay (Fades out on interaction) */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isDragging || sliderPosition !== 50 ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-xs text-white"
        >
          Drag slider to compare
        </motion.div>
      </div>
    </section>
  );
}
