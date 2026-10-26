"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";
const KEY = "theme";

// The no-flash script in layout.tsx sets data-theme before paint; this just reads and flips it.
const read = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {}
  listeners.forEach((fn) => fn());
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, () => "dark" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";
  // Dark is called Night and light is called Morning on the page.
  const label = next === "light" ? "Morning" : "Night";
  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${label.toLowerCase()} (${next}) theme`}
      title={`Switch to ${label.toLowerCase()} (${next}) theme`}
      className="px-2.5 lg:px-3.5 py-2 rounded-full text-sm font-mono text-slate-400 hover:text-teal-400 hover:bg-white/5 transition-colors flex items-center gap-2"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden xl:block">{label}</span>
    </button>
  );
}

// Inline before paint: stored choice, else the OS preference, else dark.
export const themeScript = `(function(){try{var t=localStorage.getItem('${KEY}');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){}})()`;
