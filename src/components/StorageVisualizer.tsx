"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Binary, HardDrive, Cpu, AlertCircle, Plus, Trash2, RotateCcw } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import { toast } from "./Toaster";
import { HEADER_SIZE, PAGE_SIZE, StorageEngine, type BTreeNodeSnapshot } from "@/lib/pydb";

// --- COMPILER COMPLIANT HYDRATION FIX ---
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const GRID_COLS = 16;
const GRID_BYTES = 128; // header + all live cells for a leaf comfortably fit

const WAL_COLOR: Record<string, string> = {
  INSERT: "text-teal-300",
  UPDATE: "text-sky-300",
  DELETE: "text-red-300",
  SPLIT: "text-purple-300",
  COMMIT: "text-emerald-300",
};

export default function StorageVisualizer() {
  const isMounted = useIsMounted();

  // One real engine instance, created once (lazy useState → stable + render-safe).
  const [engine] = useState(() => new StorageEngine({ seed: 1337 }));

  const snap = useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getSnapshot);

  // Seed a small tree once on mount so a real split is already visible.
  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    for (let i = 0; i < 7; i++) engine.insertRandom();
  }, [engine]);

  // Fire a toast on real split events (driven by the engine, not a timer).
  const lastSplitVersion = useRef(0);
  useEffect(() => {
    if (snap.lastSplit && snap.version !== lastSplitVersion.current) {
      lastSplitVersion.current = snap.version;
      const s = snap.lastSplit;
      if (s.causedHeightIncrease) {
        toast.success(`Root split → new root pg${s.parentId} · tree height = ${snap.height}`);
      } else {
        toast.info(`Page pg${s.leftId} full → split into pg${s.rightId} (promote ${s.promotedKey})`);
      }
    }
  }, [snap.version, snap.lastSplit, snap.height]);

  const levels = useMemo(() => {
    const byDepth: BTreeNodeSnapshot[][] = [];
    for (const n of snap.nodes) (byDepth[n.depth] ??= []).push(n);
    return byDepth;
  }, [snap.nodes]);

  const activePage = useMemo(() => {
    const id = snap.activePageId ?? snap.rootId;
    return snap.pages.find((p) => p.pageId === id) ?? snap.pages[snap.rootId];
  }, [snap.pages, snap.activePageId, snap.rootId]);

  const nearFull = snap.nodes.some((n) => n.isLeaf && n.keys.length >= snap.leafCap);

  if (!isMounted) return <div className="min-h-[500px]" />;

  return (
    <section id="storage" className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">01.</span> PyDB:
          Storage Engine
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
          A <strong className="text-slate-200">real B+Tree</strong> running in your browser — a
          TypeScript port of my PyDB engine. Insert rows and watch genuine node splits, the raw
          serialized page bytes, and the Write-Ahead Log. No mock data; the same code is covered by
          unit tests.
        </p>
      </div>

      {/* Live stats */}
      <div className="flex flex-wrap gap-3 mb-6 font-mono text-[11px]">
        {[
          { label: "rows", value: snap.rowCount },
          { label: "pages", value: snap.nodeCount },
          { label: "height", value: snap.height },
          { label: "order", value: snap.order },
          { label: "wal_entries", value: snap.wal.length },
        ].map((s) => (
          <span
            key={s.label}
            className="px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/5 text-slate-300"
          >
            <span className="text-slate-500 uppercase tracking-widest">{s.label}</span>{" "}
            <span className="text-teal-400 font-bold">{s.value}</span>
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: the live B+Tree */}
        <SpotlightCard className="p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Cpu className="text-teal-400" size={20} />
              <h3 className="font-bold text-slate-200">The Pager (RAM) — B+Tree</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => engine.insertRandom()}
                aria-label="Insert a record"
                className="px-3 py-1.5 bg-teal-500 text-slate-950 text-xs font-bold rounded-full hover:bg-teal-400 transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)] flex items-center gap-1"
              >
                <Plus size={13} /> Insert
              </button>
              <button
                onClick={() => engine.deleteRandom()}
                aria-label="Delete a random record"
                className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-full hover:bg-slate-700 transition-all flex items-center gap-1 border border-white/5"
              >
                <Trash2 size={13} /> Delete
              </button>
              <button
                onClick={() => engine.reset()}
                aria-label="Reset the engine"
                className="px-3 py-1.5 bg-slate-800 text-slate-400 text-xs font-bold rounded-full hover:bg-slate-700 transition-all flex items-center gap-1 border border-white/5"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          <div className="space-y-4 overflow-x-auto">
            {levels.map((level, depth) => (
              <div key={depth} className="flex items-start gap-3 min-w-max">
                <span className="text-[9px] font-mono text-slate-600 uppercase w-10 shrink-0 pt-2">
                  {depth === levels.length - 1 ? "leaf" : depth === 0 ? "root" : `L${depth}`}
                </span>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence mode="popLayout">
                    {level.map((node) => (
                      <motion.div
                        layout
                        key={node.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`rounded-lg border font-mono text-[11px] ${
                          node.id === snap.activePageId
                            ? "border-teal-400/70 bg-teal-500/10 shadow-[0_0_12px_rgba(45,212,191,0.25)]"
                            : "border-slate-700/60 bg-slate-800/30"
                        }`}
                      >
                        {node.isLeaf ? (
                          <div className="p-2 space-y-1 min-w-[130px]">
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest flex justify-between">
                              <span>leaf pg{node.id}</span>
                              <span>{node.keys.length}/{snap.leafCap}</span>
                            </div>
                            {node.keys.length === 0 && (
                              <div className="text-slate-600 italic text-[10px]">empty</div>
                            )}
                            {node.keys.map((k, i) => (
                              <div key={k} className="flex gap-2">
                                <span className="text-teal-500 font-bold w-8">{k}</span>
                                <span className="text-slate-400 truncate">{node.values[i]?.user}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-2 flex items-center gap-1.5">
                            <span className="text-[8px] text-slate-500 uppercase mr-1">pg{node.id}</span>
                            {node.keys.map((k) => (
                              <span
                                key={k}
                                className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-white/5"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          {nearFull && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded flex items-center gap-3 text-amber-400 text-xs font-mono"
            >
              <AlertCircle size={14} className="animate-pulse" />
              <span>A leaf is at capacity ({snap.leafCap} keys). The next key into it will split the page.</span>
            </motion.div>
          )}
        </SpotlightCard>

        {/* RIGHT: real serialized bytes of the active page */}
        <SpotlightCard className="p-8" spotlightColor="rgba(168, 85, 247, 0.15)">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <HardDrive className="text-purple-400" size={20} />
              <h3 className="font-bold text-slate-200">Disk Serialization — pg{activePage?.pageId}</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">{activePage?.role}</span>
          </div>

          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
          >
            {(activePage?.bytes ?? []).slice(0, GRID_BYTES).map((byte, i) => {
              const live = i < (activePage?.usedBytes ?? 0);
              const isHeader = i < HEADER_SIZE;
              return (
                <div
                  key={i}
                  title={`offset ${i}`}
                  className={`aspect-square rounded-[3px] text-[7px] md:text-[8px] flex items-center justify-center border transition-colors duration-300 ${
                    isHeader && live
                      ? "bg-teal-500/25 border-teal-500/40 text-teal-200"
                      : live
                        ? "bg-purple-500/30 border-purple-500/50 text-purple-100"
                        : "bg-slate-900 border-slate-800 text-slate-700"
                  }`}
                >
                  {byte.toString(16).padStart(2, "0")}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-500/40 border border-teal-500/50" /> header
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500/40 border border-purple-500/50" /> cell data
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-slate-800" /> zero-pad
            </span>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <div className="flex flex-col">
              <span>Offset: 0x{((activePage?.pageId ?? 0) * PAGE_SIZE).toString(16).padStart(4, "0")}</span>
              <span className="text-teal-500/60">
                {activePage?.usedBytes}/{PAGE_SIZE} bytes · ACID: WAL_LOGGED
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Binary size={12} />
              <span>{activePage?.role === "leaf" ? "B+TREE LEAF" : "INDEX NODE"}</span>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* WAL — the real append-only log */}
      <SpotlightCard className="p-6 mt-8" spotlightColor="rgba(45, 212, 191, 0.12)">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
            <span className="text-teal-400 font-mono text-xs">▚</span> Write-Ahead Log
          </h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            log-before-apply · {snap.wal.length} entries
          </span>
        </div>
        <div className="max-h-48 overflow-y-auto font-mono text-[10px] leading-relaxed">
          {snap.wal.length === 0 && <div className="text-slate-600">— empty —</div>}
          {snap.wal
            .slice()
            .reverse()
            .map((e) => (
              <div key={e.lsn} className="flex gap-3 py-0.5 border-b border-white/[0.03]">
                <span className="text-slate-600 w-12 shrink-0">LSN{e.lsn}</span>
                <span className="text-slate-600 w-10 shrink-0">tx{e.txId}</span>
                <span className={`w-14 shrink-0 font-bold ${WAL_COLOR[e.op] ?? "text-slate-300"}`}>
                  {e.op}
                </span>
                <span className="text-slate-500 w-14 shrink-0">
                  {e.pageId != null ? `pg${e.pageId}` : "—"}
                </span>
                <span className="text-slate-500 w-14 shrink-0">
                  {e.key != null ? `k${e.key}` : ""}
                </span>
                <span className="text-slate-400 truncate">{e.detail ?? e.payloadHex ?? ""}</span>
              </div>
            ))}
        </div>
      </SpotlightCard>
    </section>
  );
}
