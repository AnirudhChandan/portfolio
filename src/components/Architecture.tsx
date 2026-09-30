"use client";

import React, { useState } from "react";
import ReactFlow, { Background, Controls, useNodesState, Edge, Node } from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Database,
  Server,
  Globe,
  Cpu,
  Layers,
  LucideIcon,
} from "lucide-react";

// Define the structure for our node details
interface NodeDetail {
  title: string;
  desc: string;
  metrics: string;
  icon: LucideIcon;
}

// Every "Key impact" line below is also on the résumé.
const nodeDetails: Record<string, NodeDetail> = {
  "1": {
    title: "Clinic dashboards",
    desc: "The web app clinics use every day. It used to poll the API every few seconds for anything new; it now holds a WebSocket open and gets told when something changes.",
    metrics: "4,000+ clinics on the platform",
    icon: Globe,
  },
  "2": {
    title: "Node.js API",
    desc: "The REST layer (Express + Sequelize) that the v1→v2 migration moved behind. I built and led 30+ of its endpoints as one of four engineers.",
    metrics: "30+ APIs · zero-downtime migration",
    icon: Server,
  },
  "3": {
    title: "Sync service",
    desc: "Keeps records consistent while several clients write to them at once. Optimistic concurrency (a version column checked in the UPDATE) handles single-row races; distributed Redis locks cover the multi-step ones.",
    metrics: "Race conditions behind concurrent-write mismatches eliminated",
    icon: Cpu,
  },
  "4": {
    title: "Redis",
    desc: "Two jobs: short-lived locks for the sync service, and Pub/Sub so whichever API instance handles a write can notify the instance holding the user's WebSocket.",
    metrics: "80% less backend traffic after replacing polling",
    icon: Layers,
  },
  "5": {
    title: "SQL database",
    desc: "The source of truth. The v1→v2 migration moved live clinic data onto the new schema without taking the platform down.",
    metrics: "100% data integrity through the migration",
    icon: Database,
  },
};

// --- INITIAL GRAPH SETUP ---
const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 250, y: 0 },
    data: { label: "Clinic dashboards" },
    style: { background: "#0f172a", color: "#fff", border: "1px solid #2dd4bf", width: 170 },
  },
  {
    id: "2",
    position: { x: 250, y: 150 },
    data: { label: "Node.js API" },
    style: { background: "#0f172a", color: "#fff", border: "1px solid #94a3b8", width: 170 },
  },
  {
    id: "3",
    position: { x: 40, y: 300 },
    data: { label: "Sync service" },
    style: { background: "#1e1b4b", color: "#c7d2fe", border: "1px dashed #6366f1", width: 160 },
  },
  {
    id: "4",
    position: { x: 470, y: 300 },
    data: { label: "Redis (locks · Pub/Sub)" },
    style: { background: "#3f1c1c", color: "#fca5a5", border: "1px solid #ef4444", width: 170 },
  },
  {
    id: "5",
    position: { x: 250, y: 450 },
    data: { label: "SQL database" },
    style: { background: "#0f172a", color: "#fff", border: "2px solid #2dd4bf", width: 170 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, label: "REST", style: { stroke: "#2dd4bf" } },
  { id: "e2-3", source: "2", target: "3", animated: true, label: "writes" },
  { id: "e3-4", source: "3", target: "4", label: "locks" },
  { id: "e2-4", source: "2", target: "4", animated: true, label: "publish" },
  { id: "e4-1", source: "4", target: "1", animated: true, label: "push (WebSocket)", style: { stroke: "#f87171" } },
  { id: "e2-5", source: "2", target: "5", style: { stroke: "#fff" } },
  { id: "e3-5", source: "3", target: "5", animated: true, style: { stroke: "#6366f1" }, label: "versioned UPDATE" },
];

export default function Architecture() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  };

  const details = selectedNode ? nodeDetails[selectedNode] : null;

  return (
    <section
      id="architecture"
      className="py-24 px-4 md:px-12 max-w-7xl mx-auto h-[800px] relative scroll-mt-32"
    >
      <div className="mb-8">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">
            02.
          </span>{" "}
          System Architecture
        </h2>
        <p className="text-slate-400 max-w-2xl">
          A simplified map of the EHR backend I work on at Docplix: the v1→v2 migration, the
          sync layer, and the switch from polling to push.{" "}
          <span className="text-teal-400">Click a node</span> for what it does and what changed.
        </p>
      </div>

      <div className="h-[600px] w-full border border-slate-800 rounded-xl bg-slate-950/50 overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={initialEdges}
          onNodesChange={onNodesChange}
          nodesConnectable={false}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#1e293b" gap={16} />
          <Controls className="bg-slate-800 text-white border-slate-700" />
        </ReactFlow>

        {/* --- DETAILS SIDEBAR --- */}
        <AnimatePresence>
          {selectedNode && details && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-full md:w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 p-8 shadow-2xl z-20"
            >
              <button
                onClick={() => setSelectedNode(null)}
                aria-label="Close details"
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="mt-8">
                <div className="w-12 h-12 bg-teal-400/20 rounded-lg flex items-center justify-center mb-6 text-teal-400">
                  <details.icon size={24} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {details.title}
                </h3>
                <div className="h-1 w-20 bg-teal-500 rounded mb-6"></div>

                <p className="text-slate-300 leading-relaxed mb-8">
                  {details.desc}
                </p>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-teal-400/30">
                  <p className="text-xs text-teal-400 uppercase font-bold tracking-wider mb-1">
                    Key Impact
                  </p>
                  <p className="text-lg font-mono text-white">
                    {details.metrics}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instruction Overlay (Disappears on interaction) */}
        {!selectedNode && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-800/80 px-4 py-2 rounded-full text-slate-300 text-sm pointer-events-none border border-slate-700">
            Click a node · drag to rearrange
          </div>
        )}
      </div>
    </section>
  );
}
