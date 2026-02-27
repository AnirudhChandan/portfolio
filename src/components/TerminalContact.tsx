"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, CheckCircle2, AlertCircle } from "lucide-react";

export default function TerminalContact() {
  const [step, setStep] = useState<"email" | "message" | "sending" | "success">(
    "email",
  );
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (step === "email") {
        if (!email.includes("@")) {
          setHistory((prev) => [
            ...prev,
            `> Enter email: ${email}`,
            `Error: Invalid email format.`,
          ]);
          setEmail("");
          return;
        }
        setHistory((prev) => [...prev, `> Enter email: ${email}`]);
        setStep("message");
      } else if (step === "message") {
        setHistory((prev) => [...prev, `> Enter message: ${message}`]);
        setStep("sending");

        // Simulate network request
        await new Promise((resolve) => setTimeout(resolve, 800));
        setHistory((prev) => [
          ...prev,
          "Compiling packet...",
          "Encrypting payload...",
          "Handshake established...",
        ]);
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // In a real app, you would POST to an endpoint here
        console.log("Sent:", { email, message });

        setStep("success");
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  return (
    <section
      id="contact"
      className="py-32 px-6 md:px-12 max-w-5xl mx-auto scroll-mt-32"
    >
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center justify-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">
            10.
          </span>{" "}
          Initialize Handshake
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Ready to collaborate? Execute the sequence below to open a
          communication channel.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-3xl mx-auto bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-sm md:text-base relative"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="ml-4 text-slate-500 text-xs flex items-center gap-2">
            <Terminal size={12} />
            guest@portfolio:~
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 h-[400px] overflow-y-auto custom-scrollbar flex flex-col gap-2 cursor-text">
          <div className="text-slate-500 mb-4">
            Last login: {new Date().toDateString()} on ttys001
            <br />
            Type your details to send a message.
          </div>

          {/* History Log */}
          {history.map((line, i) => (
            <div
              key={i}
              className={`${line.startsWith("Error") ? "text-red-400" : "text-slate-300"}`}
            >
              {line}
            </div>
          ))}

          {/* Active Input Line */}
          {step === "email" && (
            <div className="flex items-center gap-2 text-teal-400">
              <span>{"> Enter email:"}</span>
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-slate-100 flex-1 caret-teal-400"
                autoComplete="off"
              />
            </div>
          )}

          {step === "message" && (
            <div className="flex items-center gap-2 text-teal-400">
              <span>{"> Enter message:"}</span>
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-slate-100 flex-1 caret-teal-400"
                autoComplete="off"
              />
            </div>
          )}

          {step === "sending" && (
            <div className="text-teal-400 animate-pulse">
              {"> Uploading to server..."}
            </div>
          )}

          {step === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 border border-emerald-500/20 bg-emerald-500/10 rounded-lg text-emerald-400 flex items-center gap-3"
            >
              <CheckCircle2 size={20} />
              <span>
                Message received. Anirudh will acknowledge receipt at{" "}
                <span className="font-bold underline">{email}</span> shortly.
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
