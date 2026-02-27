"use client";

import { motion } from "framer-motion";
import { Home, User, Briefcase, Mail, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Experience", href: "#experience", icon: User },
  { name: "Work", href: "#projects", icon: Briefcase },
  { name: "Contact", href: "#contact", icon: Mail },
];

export default function Navbar() {
  const [isMac, setIsMac] = useState(true);

  // Client-side detection for correct keyboard shortcut rendering
  useEffect(() => {
    setIsMac(navigator.userAgent.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center gap-1 p-2 rounded-full border border-white/10 bg-slate-950/50 backdrop-blur-md shadow-2xl"
      >
        {navItems.map((item) => (
          <motion.a
            key={item.name}
            href={item.href}
            whileHover={{ scale: 0.95 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative px-4 py-2 text-sm font-mono text-slate-400 hover:text-teal-400 transition-colors rounded-full hover:bg-white/5 flex items-center gap-2 group"
          >
            <item.icon size={16} />
            <span className="hidden sm:block">{item.name}</span>
            <span className="absolute inset-0 rounded-full bg-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>
        ))}

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>

        {/* CMD+K Trigger */}
        <motion.button
          onClick={openCommandPalette}
          whileHover={{ scale: 0.95 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative px-3 py-1.5 ml-1 text-sm font-mono text-slate-400 hover:text-teal-400 transition-colors rounded-full bg-slate-900 border border-white/5 flex items-center gap-2 group hover:border-teal-500/30"
        >
          <Search
            size={14}
            className="text-slate-500 group-hover:text-teal-400 transition-colors"
          />
          <span className="hidden sm:block text-xs text-slate-500 group-hover:text-teal-400">
            {isMac ? "⌘K" : "Ctrl K"}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
