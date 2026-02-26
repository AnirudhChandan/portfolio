"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node, // <--- 1. Import the Node Type
} from "reactflow";
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

// --- DATA: The "Resume Wins" mapped to Architecture Nodes ---
const nodeDetails: Record<string, NodeDetail> = {
  "1": {
    title: "Frontend Client (React)",
    desc: "The entry point for the Clinical Dashboard. Engineered a dual-view (List/Calendar) architecture and real-time analytics charts.",
    metrics: "Improved clinician workflow by 25%",
    icon: Globe,
  },
  "2": {
    title: "API Gateway (Node.js)",
    desc: "Centralized RESTful API layer handling inventory and patient data. Architected 30+ endpoints to decouple the legacy monolith.",
    metrics: "Handled 99.9% Data Consistency",
    icon: Server,
  },
  "3": {
    title: "Synchronization Service",
    desc: "A custom background service designed to mitigate data drift between the new Inventory System (V2) and the Legacy System (V1).",
    metrics: "Zero Critical Mismatches",
    icon: Cpu,
  },
  "4": {
    title: "Redis Cache Layer",
    desc: "Implemented caching patterns for high-read endpoints (like patient search) to offload the primary database.",
    metrics: "Reduced Latency by 40%",
    icon: Layers,
  },
  "5": {
    title: "Primary DB (Sequelize/SQL)",
    desc: "The source of truth. Optimized with advanced indexing strategies to handle complex health-record retrieval queries.",
    metrics: "Optimized Query Performance",
    icon: Database,
  },
};

// --- INITIAL GRAPH SETUP ---
const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 250, y: 0 },
    data: { label: "React Client" },
    style: {
      background: "#0f172a",
      color: "#fff",
      border: "1px solid #2dd4bf",
      width: 150,
    },
  },
  {
    id: "2",
    position: { x: 250, y: 150 },
    data: { label: "Node.js API Gateway" },
    style: {
      background: "#0f172a",
      color: "#fff",
      border: "1px solid #94a3b8",
      width: 180,
    },
  },
  {
    id: "3",
    position: { x: 50, y: 300 },
    data: { label: "Sync Service" },
    style: {
      background: "#1e1b4b",
      color: "#c7d2fe",
      border: "1px dashed #6366f1",
      width: 160,
    },
  },
  {
    id: "4",
    position: { x: 450, y: 300 },
    data: { label: "Redis Cache" },
    style: {
      background: "#3f1c1c",
      color: "#fca5a5",
      border: "1px solid #ef4444",
      width: 140,
    },
  },
  {
    id: "5",
    position: { x: 250, y: 450 },
    data: { label: "PostgreSQL DB" },
    style: {
      background: "#0f172a",
      color: "#fff",
      border: "2px solid #2dd4bf",
      width: 160,
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#2dd4bf" },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    label: "Sync Events",
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    animated: true,
    label: "Cache Hit/Miss",
  },
  { id: "e2-5", source: "2", target: "5", style: { stroke: "#fff" } },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    animated: true,
    style: { stroke: "#6366f1" },
    label: "Write Back",
  },
];

export default function Architecture() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // 2. Use the proper type here instead of 'any'
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
            04.
          </span>{" "}
          System Architecture
        </h2>
        <p className="text-slate-400 max-w-2xl">
          Interactive map of the <strong>Inventory Migration System</strong> I
          engineered at Docplix.{" "}
          <span className="text-teal-400"> Click a node</span> to see the
          engineering challenge.
        </p>
      </div>

      <div className="h-[600px] w-full border border-slate-800 rounded-xl bg-slate-950/50 overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
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
            Interact with the nodes to explore logic
          </div>
        )}
      </div>
    </section>
  );
}
