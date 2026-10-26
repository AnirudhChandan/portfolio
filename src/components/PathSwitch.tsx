"use client";

import { useSyncExternalStore } from "react";
import { track } from "@/lib/track";

// "What brings you here?" The choice reorders the home page and is remembered on this device.
// pathScript (layout.tsx) restores it before first paint, where CSS `order` shows the chosen order;
// after hydration HomePage renders the sections in that order so focus order matches what you see.
export type Path = "hiring" | "building";
const KEY = "path";

const read = () => document.documentElement.dataset.path as Path | undefined;
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const usePath = () => useSyncExternalStore(subscribe, read, () => undefined);

export function choosePath(p: Path) {
  document.documentElement.dataset.path = p;
  try {
    localStorage.setItem(KEY, p);
  } catch {}
  listeners.forEach((fn) => fn());
  track("path_select", { path: p });
}

const options: { path: Path; label: string; target: string }[] = [
  { path: "hiring", label: "I'm hiring", target: "hiring" },
  { path: "building", label: "I need something built", target: "services" },
];

export default function PathSwitch() {
  const path = usePath();
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <span id="path-label" className="text-sm text-slate-400">
        What brings you here?
      </span>
      <div role="group" aria-labelledby="path-label" className="inline-flex rounded-full border border-white/10 p-0.5 text-sm">
        {options.map((o) => (
          <button
            key={o.path}
            type="button"
            aria-pressed={path === o.path}
            onClick={() => {
              choosePath(o.path);
              document.getElementById(o.target)?.scrollIntoView();
            }}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${path === o.path ? "bg-teal-500 text-slate-950 font-semibold" : "text-slate-300 hover:text-slate-50"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {path && <span className="text-xs text-slate-500">Shown first below. Remembered on this device.</span>}
    </div>
  );
}

export const pathScript = `(function(){try{var p=localStorage.getItem('${KEY}');if(p==='hiring'||p==='building')document.documentElement.dataset.path=p}catch(e){}})()`;
