"use client";

import { useState, useMemo, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Binary,
  ChevronRight,
  HardDrive,
  Cpu,
  AlertCircle,
} from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import { toast } from "./Toaster";

interface DataRow {
  id: number;
  user: string;
  email: string;
  binarySignature: string[];
}

// Logic hoisted outside to remain pure
const generateBytes = () =>
  Array.from(
    { length: 8 },
    () =>
      "0x" +
      Math.floor(Math.random() * 16)
        .toString(16)
        .toUpperCase(),
  );

const initialRows: DataRow[] = [
  {
    id: 101,
    user: "anirudh",
    email: "ani@dev.com",
    binarySignature: generateBytes(),
  },
  {
    id: 205,
    user: "rekha",
    email: "rekha@sys.io",
    binarySignature: generateBytes(),
  },
];

// --- COMPILER COMPLIANT HYDRATION FIX ---
// This safely detects if we are on the client side without triggering cascading setState errors
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function StorageVisualizer() {
  const [rows, setRows] = useState<DataRow[]>(initialRows);
  const [pageNumber, setPageNumber] = useState(1);
  const isMounted = useIsMounted(); // <--- Clean check, no useEffect needed

  const addRow = () => {
    if (rows.length >= 6) {
      toast.info("Node Full: Splitting 8KB Page...");
      setTimeout(() => {
        setRows([
          {
            id: 700,
            user: "new_node",
            email: "split@db.io",
            binarySignature: generateBytes(),
          },
        ]);
        setPageNumber((prev) => prev + 1);
        toast.success(`Allocated New Page: Page_0${pageNumber + 1}`);
      }, 800);
      return;
    }

    const id = Math.floor(Math.random() * 900) + 100;
    const newRow: DataRow = {
      id,
      user: "guest",
      email: "user@test.com",
      binarySignature: generateBytes(),
    };
    setRows((prev) => [...prev, newRow].sort((a, b) => a.id - b.id));
  };

  const diskBytes = useMemo(() => {
    const allBytes = rows.flatMap((r) => r.binarySignature);
    const padding = Array(Math.max(0, 64 - allBytes.length)).fill("00");
    return [...allBytes, ...padding];
  }, [rows]);

  // Hydration Guard
  if (!isMounted) return <div className="min-h-[500px]" />;

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-6 flex items-center gap-4">
          <span className="text-teal-400">09.</span> PyDB: Storage Engine
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg">
          I built a disk-based <strong>B-Tree engine</strong> from scratch. This
          visualizer shows the interaction between the In-Memory Pager and the
          raw bytes on the physical SSD.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SpotlightCard className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Cpu className="text-teal-400" size={20} />
              <h3 className="font-bold text-slate-200">The Pager (RAM)</h3>
            </div>
            <button
              onClick={addRow}
              className="px-4 py-1.5 bg-teal-500 text-slate-950 text-xs font-bold rounded-full hover:bg-teal-400 transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)]"
            >
              + Insert Record
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {rows.map((row) => (
                <motion.div
                  layout
                  key={row.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="flex items-center gap-4 p-3 bg-slate-800/30 rounded border border-slate-700/50 font-mono text-xs"
                >
                  <span className="text-teal-500 w-12 shrink-0 font-bold">
                    ID:{row.id}
                  </span>
                  <span className="text-slate-400 flex-1 truncate">
                    {row.user} | {row.email}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {rows.length >= 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded flex items-center gap-3 text-amber-400 text-xs font-mono"
            >
              <AlertCircle size={14} className="animate-pulse" />
              <span>
                WARNING: Page reaching 8KB limit. Next insert will trigger
                rebalance.
              </span>
            </motion.div>
          )}
        </SpotlightCard>

        <SpotlightCard
          className="p-8"
          spotlightColor="rgba(168, 85, 247, 0.15)"
        >
          <div className="flex items-center gap-3 mb-8">
            <HardDrive className="text-purple-400" size={20} />
            <h3 className="font-bold text-slate-200">
              Disk Serialization (Page_0{pageNumber})
            </h3>
          </div>

          <div className="grid grid-cols-8 gap-2">
            {diskBytes.map((byte, i) => (
              <motion.div
                key={`${pageNumber}-${i}-${byte}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`aspect-square rounded-sm text-[8px] flex items-center justify-center border transition-all duration-300 ${
                  byte !== "00"
                    ? "bg-purple-500/30 border-purple-500/50 text-purple-200"
                    : "bg-slate-900 border-slate-800 text-slate-700"
                }`}
              >
                {byte}
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <div className="flex flex-col">
              <span>Offset: {pageNumber === 1 ? "0x0000" : "0x2000"}</span>
              <span className="text-teal-500/50">ACID: WAL_LOGGED</span>
            </div>
            <div className="flex items-center gap-2">
              <Binary size={12} />
              <span>B-TREE LEAF_NODE</span>
            </div>
            <span className="bg-slate-800 px-2 py-1 rounded">
              Page_0{pageNumber}
            </span>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
