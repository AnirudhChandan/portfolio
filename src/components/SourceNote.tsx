import { sources, type SourceId } from "@/lib/sources";

// A numbered footnote marker that opens its source in a native popover: no JavaScript, Esc and
// outside-click close it. Where CSS anchor positioning works the card sits under the marker
// (globals.css); elsewhere the browser centres it.
export default function SourceNote({ id, n }: { id: SourceId; n: number }) {
  const s = sources[id];
  const pid = `source-${id}`;
  return (
    <>
      <button
        type="button"
        popoverTarget={pid}
        aria-label={`Source ${n}: ${s.claim}`}
        style={{ anchorName: `--${pid}` }}
        className="ml-1 inline-grid place-items-center min-w-4 h-4 px-1 align-[-0.2em] rounded-full border border-teal-400/40 font-mono text-[9px] font-medium leading-none text-teal-400 hover:bg-teal-400/10 transition-colors"
      >
        {n}
      </button>
      <div
        id={pid}
        popover="auto"
        style={{ positionAnchor: `--${pid}` }}
        className="source-pop w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-slate-900 p-5 text-left font-sans font-normal tracking-normal text-slate-300 shadow-2xl shadow-black/30"
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-400 mb-2">
          Source {n} · {s.claim}
        </div>
        <p className="text-sm leading-relaxed">{s.detail}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {s.links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-mono text-teal-400 hover:text-teal-300">
              {l.label} →
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
