"use client";

import dynamic from "next/dynamic";
import Toaster from "@/components/Toaster";

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

export default function LabContent() {
  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-16 pb-32">
        <StorageVisualizer />
        <Architecture />
        <ShardingDemo />
        <RateLimitDemo />
      </div>
    </>
  );
}
