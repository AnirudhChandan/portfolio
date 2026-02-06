"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Folder } from "lucide-react";
import React, { useRef, useState } from "react";

// 1. Define the shape of the Project object
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
];

// 2. Use the Interface in the component props
const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 px-8 py-10 shadow-2xl"
    >
      {/* SPOTLIGHT OVERLAY */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(45, 212, 191, 0.1), transparent 40%)`,
        }}
      />

      {/* SPOTLIGHT BORDER */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(45, 212, 191, 0.4), transparent 40%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-8">
          <Folder size={40} className="text-teal-400" strokeWidth={1.5} />
          <div className="flex gap-4 text-slate-400 z-20">
            <a
              href={project.github}
              target="_blank"
              className="hover:text-teal-400 transition-colors"
            >
              <Github size={22} />
            </a>
            <a
              href={project.link}
              className="hover:text-teal-400 transition-colors"
            >
              <ExternalLink size={22} />
            </a>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-100 mb-4 group-hover:text-teal-400 transition-colors">
          {project.title}
        </h3>

        <p className="text-slate-400 mb-8 leading-relaxed flex-grow">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-3 mt-auto">
          {project.tech.map((t, i) => (
            <span
              key={i}
              className="text-xs font-mono text-teal-400/90 bg-teal-400/10 px-2 py-1 rounded"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function Projects() {
  return (
    <section id="projects" className="py-32 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-6 flex items-center gap-4">
          <span className="text-teal-400">03.</span> Some Things I have Built
        </h2>
        <div className="h-1 w-20 bg-teal-400/30 rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
