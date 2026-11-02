import type { ReactNode } from "react";
import { sources, type SourceId } from "@/lib/sources";

// The caption under a number, dotted-underlined: tapping it opens where the number comes from in a
// native popover (no JavaScript; Esc and outside-click close it). Where CSS anchor positioning works
// the card sits under the caption (globals.css); elsewhere the browser centres it.
export default function SourceNote({ id, children }: { id: SourceId; children: ReactNode }) {
  const s = sources[id];
  const pid = `source-${id}`;
  return (
    <>
      <button
        type="button"
        popoverTarget={pid}
        title="See where this comes from"
        style={{ anchorName: `--${pid}` }}
        className="text-left underline decoration-dotted decoration-slate-500 underline-offset-4 hover:text-slate-200 hover:decoration-teal-400 transition-colors"
      >
        {children}
        <span className="sr-only"> (see where this comes from)</span>
      </button>
      <div
        id={pid}
        popover="auto"
        style={{ positionAnchor: `--${pid}` }}
        className="source-pop w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-slate-900 p-5 text-left text-sm leading-relaxed text-slate-300 shadow-2xl shadow-black/30"
      >
        <p>{s.detail}</p>
        {s.links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {s.links.map((l) => (
              <a key={l.href} href={l.href} className="text-teal-400 hover:text-teal-300">
                {l.label} →
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
