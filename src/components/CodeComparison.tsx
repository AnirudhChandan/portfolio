"use client";

import { useState, useRef, useEffect } from "react";
import { MoveHorizontal, AlertTriangle, CheckCircle2 } from "lucide-react";

const legacyCode = `// ❌ THE PROBLEM: N+1 Query Issue
const users = await User.findAll();
const results = [];

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
const users = await User.findAll({
  include: [{
    model: Post,
    attributes: ['title', 'content'] 
  }],
  attributes: ['id', 'name', 'email'],
  limit: 100
});`;

const HighlightedCode = ({
  code,
  type,
}: {
  code: string;
  type: "bad" | "good";
}) => {
  return (
    <pre className="font-mono text-xs md:text-sm leading-6 overflow-x-auto custom-scrollbar">
      {code.split("\n").map((line, i) => (
        <div key={i} className="table-row">
          <span className="table-cell select-none text-slate-700 text-right pr-4 w-8">
            {i + 1}
          </span>
          <span className="table-cell">
            {line.split(" ").map((token, j) => {
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

  // Safely handling both React Synthetic Events and Native DOM Events
  const handleMouseMove = (
    e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
  ) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // Type-safe touch detection
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));

    setSliderPosition((x / rect.width) * 100);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove as EventListener);
      window.addEventListener("touchmove", handleMouseMove as EventListener);
    } else {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove as EventListener);
      window.removeEventListener("touchmove", handleMouseMove as EventListener);
    }
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove as EventListener);
      window.removeEventListener("touchmove", handleMouseMove as EventListener);
    };
  }, [isDragging]);

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-32">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">
            07.
          </span>{" "}
          Code Optimization
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg">
          I do not just write code; I{" "}
          <span className="text-teal-400">optimize</span> it. Drag the slider to
          see how I refactored a legacy N+1 query problem into a scalable
          solution.
        </p>
      </div>

      {/* --- MOBILE VIEW: Stacked vertically to prevent scroll trapping --- */}
      <div className="md:hidden flex flex-col gap-6">
        <div className="bg-[#161b22] border border-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 text-red-400 mb-4">
            <AlertTriangle size={18} />
            <span className="font-bold text-sm tracking-wider uppercase">
              Legacy Code
            </span>
          </div>
          <HighlightedCode code={legacyCode} type="bad" />
        </div>

        <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 mb-4">
            <CheckCircle2 size={18} />
            <span className="font-bold text-sm tracking-wider uppercase">
              Optimized V2.0
            </span>
          </div>
          <HighlightedCode code={optimizedCode} type="good" />
        </div>
      </div>

      {/* --- DESKTOP VIEW: Interactive Slider --- */}
      <div
        className="hidden md:block relative w-full max-w-4xl mx-auto h-[400px] select-none rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-[#0d1117]"
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* RIGHT SIDE (OPTIMIZED CODE - Background Layer) */}
        <div className="absolute inset-0 bg-[#0d1117] p-8">
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
          className="absolute inset-0 bg-[#161b22] overflow-hidden border-r border-slate-600"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="w-full max-w-4xl p-8 whitespace-nowrap">
            <div className="flex items-center justify-between mb-4 w-[800px]">
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
          className="absolute top-0 bottom-0 w-1 bg-slate-400 cursor-ew-resize z-10 flex items-center justify-center hover:bg-teal-400 transition-colors"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center shadow-lg transform -translate-x-0.5 border border-slate-400">
            <MoveHorizontal size={16} className="text-slate-900" />
          </div>
        </div>
      </div>
    </section>
  );
}
