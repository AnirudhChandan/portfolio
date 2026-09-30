"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  Briefcase,
  Database,
  Mail,
  Github,
  Linkedin,
  ChevronRight,
  X,
  Cpu,
  LayoutTemplate,
  Calendar,
  Copy,
  BookOpen,
} from "lucide-react";
import BookingModal from "./BookingModal";
import { toast } from "./Toaster";
import { posts } from "@/lib/posts";

type Action = {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  keywords?: string; // extra text to match on, beyond the title
  perform: () => void;
};

const EMAIL = "anichandan124@gmail.com";

// Scroll to a home-page section when we're on the home page; otherwise navigate there.
// The palette is mounted in the root layout, so it has to work from /lab and /blog too.
function goToSection(id: string) {
  const el = document.getElementById(id);
  if (el && window.location.pathname === "/") el.scrollIntoView({ behavior: "smooth" });
  else window.location.href = `/#${id}`;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
    document.body.style.overflow = "";
  }, []);

  const openBooking = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setIsBookingOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeBooking = useCallback(() => {
    setIsBookingOpen(false);
    document.body.style.overflow = "";
  }, []);

  const actions: Action[] = useMemo(
    () => [
      {
        id: "resume",
        title: "Open Résumé (PDF)",
        category: "Documents",
        icon: <FileText size={16} />,
        perform: () => window.open("/ANIRUDH_CHANDAN_RESUME_2026.pdf", "_blank"),
      },
      {
        id: "schedule",
        title: "Book a call",
        category: "Connect",
        icon: <Calendar size={16} />,
        perform: openBooking,
      },
      {
        id: "copy-email",
        title: "Copy email address",
        category: "Connect",
        icon: <Copy size={16} />,
        perform: () => {
          navigator.clipboard?.writeText(EMAIL).then(
            () => toast.success(`Copied ${EMAIL}`),
            () => toast.error("Couldn't access the clipboard"),
          );
        },
      },
      {
        id: "contact",
        title: "Email Anirudh",
        category: "Connect",
        icon: <Mail size={16} />,
        perform: () => {
          window.location.href = `mailto:${EMAIL}`;
        },
      },
      {
        id: "nav-lab",
        title: "Enter the Lab (live demos)",
        category: "Navigation",
        icon: <Cpu size={16} />,
        perform: () => {
          window.location.href = "/lab";
        },
      },
      {
        id: "nav-experience",
        title: "Go to Experience",
        category: "Navigation",
        icon: <Briefcase size={16} />,
        perform: () => goToSection("experience"),
      },
      {
        id: "nav-projects",
        title: "Go to Projects",
        category: "Navigation",
        icon: <LayoutTemplate size={16} />,
        perform: () => goToSection("projects"),
      },
      {
        id: "nav-blog",
        title: "All writing",
        category: "Navigation",
        icon: <BookOpen size={16} />,
        perform: () => {
          window.location.href = "/blog";
        },
      },
      ...posts.map((p) => ({
        id: `post-${p.slug}`,
        title: `Read: ${p.title}`,
        category: "Writing",
        keywords: `${p.tag} ${p.excerpt}`,
        icon: <BookOpen size={16} />,
        perform: () => {
          window.location.href = `/blog/${p.slug}`;
        },
      })),
      {
        id: "pydb",
        title: "View PyDB source code",
        category: "Projects",
        icon: <Database size={16} />,
        perform: () => window.open("https://github.com/AnirudhChandan/PyDB", "_blank"),
      },
      {
        id: "github",
        title: "Open GitHub profile",
        category: "Connect",
        icon: <Github size={16} />,
        perform: () => window.open("https://github.com/AnirudhChandan", "_blank"),
      },
      {
        id: "linkedin",
        title: "Open LinkedIn profile",
        category: "Connect",
        icon: <Linkedin size={16} />,
        perform: () => window.open("https://www.linkedin.com/in/anirudh-chandan/", "_blank"),
      },
    ],
    [openBooking],
  );

  const q = query.trim().toLowerCase();
  const filteredActions = q
    ? actions.filter((a) => `${a.title} ${a.category} ${a.keywords ?? ""}`.toLowerCase().includes(q))
    : actions;

  const run = (action: Action) => {
    action.perform();
    if (action.id !== "schedule") closePalette();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) closePalette();
        else open();
      }
      if (e.key === "Escape") {
        if (isBookingOpen) closeBooking();
        else if (isOpen) closePalette();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", open);
    window.addEventListener("open-booking", openBooking);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", open);
      window.removeEventListener("open-booking", openBooking);
    };
  }, [isOpen, isBookingOpen, open, closePalette, openBooking, closeBooking]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (filteredActions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(filteredActions[selectedIndex]);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePalette}
              className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm"
            />

            <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto shadow-black/50"
              >
                <div className="flex items-center px-4 py-4 border-b border-white/5">
                  <Search size={20} className="text-teal-400 mr-3 shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Type a command or search…"
                    aria-label="Search commands"
                    className="flex-1 bg-transparent border-none outline-none focus-visible:outline-none text-slate-200 text-lg placeholder:text-slate-500 font-sans"
                  />
                  <button
                    onClick={closePalette}
                    aria-label="Close command palette"
                    className="p-1 rounded-md bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {filteredActions.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 font-mono text-sm">
                      No results for &quot;{query}&quot;
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {filteredActions.map((action, index) => {
                        const isSelected = index === selectedIndex;
                        return (
                          <button
                            key={action.id}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onClick={() => run(action)}
                            className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                              isSelected
                                ? "bg-teal-500/10 border border-teal-500/20"
                                : "bg-transparent border border-transparent hover:bg-white/5"
                            }`}
                          >
                            <span className="flex items-center gap-3 min-w-0">
                              <span
                                className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-teal-500/20 text-teal-400" : "bg-slate-800 text-slate-400"}`}
                              >
                                {action.icon}
                              </span>
                              <span className="flex flex-col min-w-0">
                                <span
                                  className={`text-sm font-bold truncate ${isSelected ? "text-slate-100" : "text-slate-300"}`}
                                >
                                  {action.title}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
                                  {action.category}
                                </span>
                              </span>
                            </span>
                            {isSelected && (
                              <span className="text-teal-400 text-xs font-mono hidden md:flex items-center gap-1 shrink-0">
                                Return <ChevronRight size={14} />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="bg-slate-950/50 p-3 border-t border-white/5 flex items-center justify-center gap-6 text-[10px] font-mono text-slate-500 uppercase">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">↑</kbd>{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">↓</kbd> to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">Enter</kbd> to select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">Esc</kbd> to close
                  </span>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <BookingModal isOpen={isBookingOpen} onClose={closeBooking} />
    </>
  );
}
