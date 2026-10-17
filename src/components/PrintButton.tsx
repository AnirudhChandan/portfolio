"use client";

import { Printer } from "lucide-react";
import { useEffect } from "react";
import { track } from "@/lib/track";

// Prints in the light theme whatever the screen theme is (also for Ctrl/Cmd+P on this page).
export default function PrintButton() {
  useEffect(() => {
    const root = document.documentElement;
    let prev: string | undefined;
    const before = () => {
      prev = root.dataset.theme;
      root.dataset.theme = "light";
    };
    const after = () => {
      if (prev) root.dataset.theme = prev;
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);

  return (
    <button
      onClick={() => {
        track("checklist_print");
        window.print();
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/5"
    >
      <Printer size={16} /> Print or save as PDF
    </button>
  );
}
