"use client";

import { Github, ExternalLink, Folder } from "lucide-react";
import SpotlightCard from "./SpotlightCard"; // <--- Import the new component

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  link: string;
}

const projects: Project[] = [
  {
    title: "Real-Time Chat Application",
    description:
      "A scalable full-stack chat platform engineered for high concurrency. Features real-time bi-directional communication, secure JWT authentication, and persistent message storage.",
    tech: ["Node.js", "Socket.io", "React", "MongoDB", "JWT"],
    github: "https://github.com/anichandan124",
    link: "#",
  },
  {
    title: "Movie Recommendation API",
    description:
      "A machine-learning powered RESTful API. Implements Content-Based Filtering using Cosine Similarity to provide personalized movie suggestions based on metadata.",
    tech: ["Python", "Flask", "Scikit-learn", "MongoDB", "API Gateway"],
    github: "https://github.com/anichandan124",
    link: "#",
  },
  {
    title: "Inventory Sync Engine",
    description:
      "Built for Docplix. A background worker service that synchronizes legacy SQL data with modern NoSQL cloud storage, handling 10k+ records per minute with conflict resolution.",
    tech: ["Typescript", "PostgreSQL", "BullMQ", "Redis"],
    github: "https://github.com/anichandan124",
    link: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-6 flex items-center gap-4">
          <span className="text-teal-400">03.</span> Featured Projects
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg">
          A selection of systems I have architected, focusing on{" "}
          <span className="text-teal-400">scalability</span> and{" "}
          <span className="text-teal-400">performance</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          // Using SpotlightCard instead of standard div
          <SpotlightCard key={index} className="p-8 h-full flex flex-col group">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-800/50 rounded-lg text-teal-400 group-hover:text-white transition-colors">
                <Folder size={24} />
              </div>
              <div className="flex gap-4 text-slate-400 z-20">
                <a
                  href={project.github}
                  target="_blank"
                  className="hover:text-teal-400 transition-colors transform hover:-translate-y-1 duration-300"
                >
                  <Github size={20} />
                </a>
                <a
                  href={project.link}
                  className="hover:text-teal-400 transition-colors transform hover:-translate-y-1 duration-300"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-teal-400 transition-colors">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="text-xs font-mono text-teal-400/80 bg-teal-400/5 px-2 py-1 rounded border border-teal-400/10"
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
