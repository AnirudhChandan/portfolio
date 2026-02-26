"use client";

import { Github, ExternalLink, Folder, Database } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  link: string;
}

const projects: Project[] = [
  {
    title: "PyDB: Storage Engine",
    description:
      "A disk-based relational B-Tree storage engine implemented in Python. Features a custom Disk Pager, WAL for ACID compliance, and raw binary serialization using struct packing.",
    tech: ["Python", "B-Tree", "Binary Serialization", "File I/O"],
    github: "https://github.com/anichandan124",
    link: "#",
  },
  {
    title: "Real-Time Chat Application",
    description:
      "A scalable full-stack chat platform engineered for high concurrency. Features real-time bi-directional communication and persistent message storage.",
    tech: ["Node.js", "Socket.io", "React", "MongoDB"],
    github: "https://github.com/anichandan124",
    link: "#",
  },
  {
    title: "Inventory Sync Engine",
    description:
      "Built for Docplix. A background worker service that synchronizes legacy SQL data with modern NoSQL cloud storage, handling conflict resolution at scale.",
    tech: ["Typescript", "PostgreSQL", "BullMQ", "Redis"],
    github: "https://github.com/anichandan124",
    link: "#",
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-32"
    >
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">
            03.
          </span>{" "}
          Featured Work
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <SpotlightCard key={index} className="p-8 h-full flex flex-col group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-800/50 rounded-lg text-teal-400 group-hover:text-white transition-colors">
                {project.title.includes("PyDB") ? (
                  <Database size={24} />
                ) : (
                  <Folder size={24} />
                )}
              </div>
              <div className="flex gap-4 text-slate-400 z-20">
                <a href={project.github} target="_blank">
                  <Github size={20} className="hover:text-teal-400" />
                </a>
                <a href={project.link}>
                  <ExternalLink size={20} className="hover:text-teal-400" />
                </a>
              </div>
            </div>
            {/* Project Title using font-display */}
            <h3 className="text-2xl font-display font-bold text-slate-100 mb-3 group-hover:text-teal-400 transition-colors tracking-tight">
              {project.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono text-teal-400/80 bg-teal-400/5 px-2 py-1 rounded border border-teal-400/10 uppercase tracking-tighter"
                >
                  {t}
                </span>
              ))}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
