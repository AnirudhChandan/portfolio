"use client";

import { useEffect, useState } from "react";
import { Github, Code2, Users, GitFork } from "lucide-react";
import Reveal from "./Reveal";

interface Stats {
  github: { repos: number | null; followers: number | null };
  leetcode: { solved: number | null };
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [graphOk, setGraphOk] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d: Stats) => {
        if (active) setStats(d);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const solved = stats?.leetcode.solved ?? null;
  const repos = stats?.github.repos ?? null;
  const followers = stats?.github.followers ?? null;

  const cards = [
    {
      icon: <Code2 size={16} />,
      label: "LeetCode solved",
      value: solved != null ? String(solved) : "450+",
      href: "https://leetcode.com/u/crytondre/",
    },
    {
      icon: <GitFork size={16} />,
      label: "Public repos",
      value: repos != null ? String(repos) : "20+",
      href: "https://github.com/AnirudhChandan?tab=repositories",
    },
    {
      icon: <Users size={16} />,
      label: "GitHub followers",
      value: followers != null ? String(followers) : "—",
      href: "https://github.com/AnirudhChandan",
    },
  ];

  return (
    <section id="stats" className="py-16 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-32">
      <Reveal>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[10px] font-mono text-teal-400 uppercase tracking-[0.3em]">
            Live signal
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Reveal className="lg:col-span-2">
          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-6 h-full">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase mb-4">
              <Github size={14} className="text-teal-400" /> GitHub contributions
            </div>
            {graphOk ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="https://ghchart.rshah.org/2dd4bf/AnirudhChandan"
                alt="Anirudh Chandan's GitHub contribution graph"
                loading="lazy"
                onError={() => setGraphOk(false)}
                className="w-full opacity-90"
              />
            ) : (
              <div className="text-slate-500 text-sm font-mono py-10 text-center">
                Graph unavailable —{" "}
                <a
                  className="text-teal-400 hover:underline"
                  href="https://github.com/AnirudhChandan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  view on GitHub →
                </a>
              </div>
            )}
          </div>
        </Reveal>

        <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
          {cards.map((c, i) => (
            <Reveal key={c.label} delay={0.05 * i}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-white/5 bg-slate-900/40 p-5 hover:border-teal-500/30 transition-colors h-full"
              >
                <div className="flex items-center gap-2 text-slate-500 mb-2">{c.icon}</div>
                <div className="text-2xl md:text-3xl font-display font-black text-slate-100">
                  {c.value}
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1">
                  {c.label}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
