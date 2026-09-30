"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

function Skeleton() {
  return (
    <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto animate-pulse" aria-hidden="true">
      <div className="h-10 w-64 bg-slate-800/60 rounded-lg mb-8" />
      <div className="h-80 bg-slate-900/40 border border-white/5 rounded-xl" />
    </div>
  );
}

const StorageVisualizer = dynamic(() => import("@/components/StorageVisualizer"), {
  ssr: false,
  loading: Skeleton,
});
const Architecture = dynamic(() => import("@/components/Architecture"), {
  ssr: false,
  loading: Skeleton,
});
const ShardingDemo = dynamic(() => import("@/components/ShardingDemo"), {
  ssr: false,
  loading: Skeleton,
});
const RateLimitDemo = dynamic(() => import("@/components/RateLimitDemo"), {
  ssr: false,
  loading: Skeleton,
});

const SECTION_IDS = ["storage", "architecture", "sharding", "ratelimit"];

// The demos render client-side only, so when someone arrives via /lab#sharding the
// browser has already tried (and failed) to scroll before the section exists. Wait
// until every demo has rendered (earlier ones change height as they mount), then
// scroll once, a frame later so the layout has settled.
function useScrollToHashWhenReady() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!SECTION_IDS.includes(id)) return;
    let frame = 0;
    const deadline = performance.now() + 4000;
    const tick = () => {
      const ready = SECTION_IDS.every((s) => document.getElementById(s));
      if (ready || performance.now() > deadline) {
        frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
      } else {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
}

export default function LabContent() {
  useScrollToHashWhenReady();
  return (
    <div className="flex flex-col gap-16 pb-32">
      <StorageVisualizer />
      <Architecture />
      <ShardingDemo />
      <RateLimitDemo />
    </div>
  );
}
