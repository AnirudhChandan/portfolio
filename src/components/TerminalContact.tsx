"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  CheckCircle2,
  Loader2,
  Wifi,
  Minimize,
  Maximize,
  X,
} from "lucide-react";
import { toast } from "./Toaster";

export default function TerminalContact() {
  const [step, setStep] = useState<"email" | "message" | "sending" | "success">(
    "email",
  );
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, step]);

  // Focus management
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [step]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (step === "email") {
        if (!email.includes("@") || !email.includes(".")) {
          setHistory((prev) => [
            ...prev,
            `> Enter email: ${email}`,
            `❌ Error: Invalid email format. Protocol rejected.`,
          ]);
          setEmail("");
          return;
        }
        setHistory((prev) => [...prev, `> Enter email: ${email}`]);
        setStep("message");
      } else if (step === "message") {
        if (!message.trim()) return;

        setHistory((prev) => [...prev, `> Enter message: ${message}`]);
        setStep("sending");

        const delay = (ms: number) =>
          new Promise<void>((resolve) => setTimeout(resolve, ms));

        // Cinematic delay sequence
        setHistory((prev) => [...prev, "Initializing secure handshake..."]);
        await delay(800);

        setHistory((prev) => [...prev, "Encrypting payload (AES-256)..."]);
        await delay(800);

        setHistory((prev) => [...prev, "Routing through proxy nodes..."]);
        await delay(1200);

        console.log("Packet Sent:", { email, message });

        setStep("success");
        toast.success("Transmission Received.");
      }
    }
  };

  return (
    <section
      id="contact"
      className="py-32 px-4 md:px-12 max-w-5xl mx-auto scroll-mt-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center justify-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">
            10.
          </span>{" "}
          Initialize Handshake
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Establish a direct communication link.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        /* UPGRADE: Glassmorphism container with backdrop blur */
        className="w-full max-w-3xl mx-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-sm md:text-base relative group"
        onClick={() => inputRef.current?.focus()}
      >
        {/* UPGRADE: CRT Scanline Overlay - Pure CSS magic */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />

        {/* Terminal Window Header */}
        <div className="bg-white/5 border-b border-white/5 p-3 flex items-center justify-between backdrop-blur-md relative z-20">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500/50" />
          </div>

          <div className="text-slate-400 text-xs flex items-center gap-2 font-mono uppercase tracking-widest opacity-80">
            <Terminal size={12} />
            <span>guest@anirudh.dev</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] text-teal-400 font-bold tracking-wider">
                SECURE
              </span>
            </div>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={containerRef}
          className="p-6 h-[450px] overflow-y-auto custom-scrollbar flex flex-col gap-2 cursor-text relative z-0"
        >
          {/* ASCII Header for flair */}
          <div className="text-slate-600 mb-6 select-none font-bold text-[10px] leading-3 opacity-50 hidden md:block">
            {`
   __   _   _  _  ____  __  __  ____  _  _ 
  / _\\ ( \\ ( )( )(  _ \\(  )(  )(  _ \\/ )( \\
 /    \\/  \\/ / )(__)  )(__)(  )(_) ) )(__ (
 \\_/\\_/\\_/\\_/ (__)   (______)(____/ (_)(_)
            `}
          </div>

          <div className="text-slate-500 mb-4 select-none">
            Welcome to Anirudh Interactive Shell v2.0.4
            <br />
            Connection established via TLS 1.3
            <br />
            Type your message to begin transmission...
            <br />
            ----------------------------------------------------------------
          </div>

          {/* History Log */}
          {history.map((line, i) => (
            <div
              key={i}
              className={`${line.startsWith("❌") ? "text-red-400" : line.startsWith(">") ? "text-slate-400" : "text-teal-400/80"}`}
            >
              {line}
            </div>
          ))}

          {/* Active Input Line - Email */}
          {step === "email" && (
            <div className="flex items-center gap-2 text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">
              <span className="shrink-0">{"> Enter email:"}</span>
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-teal-50 flex-1 caret-teal-400 font-bold placeholder:text-slate-700"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          )}

          {/* Active Input Line - Message */}
          {step === "message" && (
            <div className="flex items-center gap-2 text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">
              <span className="shrink-0">{"> Enter message:"}</span>
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-teal-50 flex-1 caret-teal-400 font-bold"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          )}

          {/* Loading State */}
          {step === "sending" && (
            <div className="flex items-center gap-2 text-teal-400 animate-pulse">
              <Loader2 size={16} className="animate-spin" />
              <span>Processing transmission...</span>
            </div>
          )}

          {/* Success State */}
          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-lg text-emerald-400 flex items-start gap-3 backdrop-blur-sm"
            >
              <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">
                  Packet Successfully Delivered.
                </span>
                <span className="text-emerald-400/70 text-sm">
                  The host has been notified. You will receive an acknowledgment
                  at{" "}
                  <span className="font-mono text-emerald-300 border-b border-emerald-500/30">
                    {email}
                  </span>{" "}
                  shortly.
                </span>
              </div>
            </motion.div>
          )}

          {/* Flashing Block Cursor */}
          {step !== "sending" && step !== "success" && (
            <div className="w-2.5 h-5 bg-teal-500/50 animate-pulse mt-1 shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
          )}
        </div>
      </motion.div>
    </section>
  );
}
