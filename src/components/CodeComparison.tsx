"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoveHorizontal,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Database,
  Clock,
  Terminal,
  Zap,
} from "lucide-react";

const legacyCode = `// ❌ THE PROBLEM: N+1 Query Issue
async function getUsersWithPosts() {
  // 1. Fetch all users (1 query)
  const users = await User.findAll();
  const results = [];

  // 2. Loop triggers DB call for EACH user
  for (const user of users) {
    // ⚠️ CRITICAL: 100 users = 100 extra queries
    const posts = await Post.findAll({
      where: { userId: user.id }
    });
    
    results.push({ ...user, posts });
  }
  
  return results;
}`;

const optimizedCode = `// ✅ THE FIX: Eager Loading & Projection
async function getUsersWithPosts() {
  // 1. Fetch everything in ONE optimized query
  const users = await User.findAll({
    // JOIN is handled at DB level
    include: [{
      model: Post,
      attributes: ['title', 'content'] 
    }],
    // Select only needed fields
    attributes: ['id', 'name', 'email'],
    limit: 100
  });

  return users;
}`;

// Reusable Syntax Highlighter
const HighlightedCode = ({
  code,
  type,
}: {
  code: string;
  type: "bad" | "good";
}) => {
  return (
    <pre className="font-mono text-xs md:text-sm leading-6 overflow-x-auto custom-scrollbar pt-4 px-4 bg-[#1e1e1e] h-full text-slate-300">
      {code.split("\n").map((line, i) => (
        <div key={i} className="table-row">
          {/* Line Numbers */}
          <span className="table-cell select-none text-[#858585] text-right pr-4 w-8 border-r border-[#404040]/30">
            {i + 1}
          </span>
          <span className="table-cell pl-4">
            {line.split(" ").map((token, j) => {
              let color = "text-[#d4d4d4]"; // Default VS Code text

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

              // VS Code-ish Syntax Highlighting
              if (
                [
                  "const",
                  "async",
                  "function",
                  "await",
                  "for",
                  "if",
                  "return",
                  "let",
                  "var",
                ].includes(token)
              )
                color = "text-[#569cd6]"; // Blue keywords
              if (
                [
                  "User",
                  "Post",
                  "console",
                  "results",
                  "users",
                  "posts",
                ].includes(token.replace(/\./g, ""))
              )
                color = "text-[#4ec9b0]"; // Teal classes/vars
              if (
                token.includes("findAll") ||
                token.includes("push") ||
                token.includes("where") ||
                token.includes("include")
              )
                color = "text-[#dcdcaa]"; // Yellow functions
              if (
                token.includes("{") ||
                token.includes("}") ||
                token.includes("(") ||
                token.includes(")")
              )
                color = "text-[#ffd700]"; // Gold brackets
              if (token.startsWith("'") || token.startsWith('"'))
                color = "text-[#ce9178]"; // Orange strings

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

  const handleMouseMove = (
    e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
  ) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
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
          <span className="text-teal-400">profile and refactor</span> it. Drag
          the slider to compare the performance footprint of a legacy N+1 query
          versus my optimized solution.
        </p>
      </div>

      {/* --- DESKTOP VIEW: VS Code Interactive Slider --- */}
      {/* We hide this on mobile and show a stacked view instead (code below) */}
      <div
        className="hidden md:block relative w-full max-w-5xl mx-auto h-[500px] select-none rounded-xl overflow-hidden shadow-2xl border border-[#333]"
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* VS Code Header - Static Background */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-[#252526] flex items-center px-4 border-b border-[#1e1e1e] z-30">
          <div className="flex gap-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] text-slate-300 text-xs font-mono rounded-t-md border-t border-l border-r border-transparent">
            <FileCode size={14} className="text-blue-400" />
            <span>user-controller.ts</span>
            <span className="ml-2 text-xs opacity-50">×</span>
          </div>
        </div>

        {/* === RIGHT SIDE (OPTIMIZED CODE) === */}
        <div className="absolute inset-0 bg-[#1e1e1e] pt-10">
          {/* Green Metrics Badge */}
          <div className="absolute top-14 right-6 z-10 flex flex-col items-end gap-2 pointer-events-none">
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg backdrop-blur-md shadow-xl flex items-center gap-3">
              <Zap size={18} className="fill-current" />
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase tracking-wider opacity-80">
                  Execution Time
                </div>
                <div className="font-bold font-mono text-lg leading-none">
                  15ms
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-md text-xs font-mono flex items-center gap-2">
              <Database size={12} />
              <span>1 Query Executed</span>
            </div>
          </div>

          <HighlightedCode code={optimizedCode} type="good" />
        </div>

        {/* === LEFT SIDE (LEGACY CODE) === */}
        <div
          className="absolute inset-0 bg-[#1e1e1e] pt-10 overflow-hidden border-r border-[#404040]"
          style={{ width: `${sliderPosition}%` }}
        >
          {/* Red Metrics Badge */}
          <div className="absolute top-14 left-6 z-10 flex flex-col items-start gap-2 pointer-events-none">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg backdrop-blur-md shadow-xl flex items-center gap-3">
              <AlertTriangle size={18} className="fill-current" />
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase tracking-wider opacity-80">
                  Execution Time
                </div>
                <div className="font-bold font-mono text-lg leading-none">
                  480ms
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 text-red-300 px-3 py-1.5 rounded-md text-xs font-mono flex items-center gap-2">
              <Database size={12} />
              <span>101 Queries (N+1)</span>
            </div>
          </div>

          <div className="w-[1024px] h-full">
            {" "}
            {/* Force width to prevent wrapping */}
            <HighlightedCode code={legacyCode} type="bad" />
          </div>
        </div>

        {/* SLIDER HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-teal-400 cursor-ew-resize z-40 flex items-center justify-center hover:shadow-[0_0_15px_rgba(45,212,191,0.6)] transition-shadow"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center shadow-lg transform -translate-x-0.5 border-2 border-[#1e1e1e]">
            <MoveHorizontal size={16} className="text-[#1e1e1e]" />
          </div>
        </div>

        {/* VS Code Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#007acc] flex items-center justify-between px-3 text-[10px] text-white font-mono z-30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Terminal size={10} />
              <span>MASTER*</span>
            </div>
            <div className="flex items-center gap-1 opacity-80">
              <AlertTriangle size={10} />
              <span>0 Errors</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>Ln 12, Col 42</span>
            <span>UTF-8</span>
            <span>TypeScript React</span>
          </div>
        </div>
      </div>

      {/* --- MOBILE VIEW: Stacked for Usability --- */}
      <div className="md:hidden flex flex-col gap-6">
        <div className="bg-[#1e1e1e] border border-red-500/30 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-[#252526] p-3 flex items-center justify-between border-b border-red-500/10">
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle size={14} /> Legacy Implementation
            </div>
            <span className="text-red-400 font-mono text-xs">480ms</span>
          </div>
          <HighlightedCode code={legacyCode} type="bad" />
        </div>

        <div className="bg-[#1e1e1e] border border-emerald-500/30 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-[#252526] p-3 flex items-center justify-between border-b border-emerald-500/10">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 size={14} /> Optimized Solution
            </div>
            <span className="text-emerald-400 font-mono text-xs">15ms</span>
          </div>
          <HighlightedCode code={optimizedCode} type="good" />
        </div>
      </div>
    </section>
  );
}
