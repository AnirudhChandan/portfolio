"use client";

import { motion } from "framer-motion";
import { Home, User, Briefcase, Mail } from "lucide-react";
import Link from "next/link";

const navItems = [
  { name: "Home", href: "#", icon: Home },
  { name: "Experience", href: "#experience", icon: User },
  { name: "Work", href: "#projects", icon: Briefcase },
  { name: "Contact", href: "#contact", icon: Mail },
];

export default function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center gap-1 p-2 rounded-full border border-white/10 bg-slate-950/50 backdrop-blur-md shadow-2xl"
      >
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="relative px-4 py-2 text-sm font-mono text-slate-400 hover:text-teal-400 transition-colors rounded-full hover:bg-white/5 flex items-center gap-2 group"
          >
            {/* Icon (Visible on all screens) */}
            <item.icon size={16} />

            {/* Text (Hidden on small mobile screens to save space) */}
            <span className="hidden sm:block">{item.name}</span>

            {/* Subtle glow effect on hover */}
            <span className="absolute inset-0 rounded-full bg-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
