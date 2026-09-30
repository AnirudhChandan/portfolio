"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, CheckCircle2, Loader2, AlertTriangle, Mail } from "lucide-react";
import { toast } from "./Toaster";

const EMAIL = "anichandan124@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = "email" | "message" | "sending" | "success" | "undelivered";
type Line = { text: string; tone: "cmd" | "ok" | "err" | "muted" };

function mailtoFor(from: string, message: string) {
  const subject = encodeURIComponent("Hello from your portfolio");
  const body = encodeURIComponent(`${message}\n\n— ${from}`);
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

// A terminal-styled contact form. Everything it prints is what actually
// happened: the real request, the real HTTP status, and — if email delivery
// isn't configured on the server — a plain "this did not reach me" with a
// ready-made mailto fallback, never a fake success.
export default function TerminalContact() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const print = (...add: Line[]) => setLines((prev) => [...prev, ...add]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [lines, step]);

  const send = async () => {
    print({ text: `> message: ${message}`, tone: "cmd" }, { text: "$ POST /api/contact", tone: "muted" });
    setStep("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        print({ text: `HTTP ${res.status} · ${data?.error ?? "request failed"}`, tone: "err" });
        setStep("message");
        return;
      }
      if (data?.delivered === false) {
        print({ text: `HTTP ${res.status} · accepted, but email delivery is not configured`, tone: "err" });
        setStep("undelivered");
        return;
      }
      print({ text: `HTTP ${res.status} · delivered`, tone: "ok" });
      setStep("success");
      toast.success("Message delivered");
    } catch {
      print({ text: "network error · nothing was sent — try again", tone: "err" });
      setStep("message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (step === "email") {
      const value = email.trim();
      if (!EMAIL_RE.test(value)) {
        print({ text: `> email: ${value || "(empty)"}`, tone: "cmd" }, { text: "that doesn't look like an email address", tone: "err" });
        setEmail("");
        return;
      }
      setEmail(value);
      print({ text: `> email: ${value}`, tone: "cmd" });
      setStep("message");
    } else if (step === "message" && message.trim()) {
      void send();
    }
  };

  const copyEmail = () =>
    navigator.clipboard?.writeText(EMAIL).then(
      () => toast.success(`Copied ${EMAIL}`),
      () => toast.error("Couldn't access the clipboard"),
    );

  return (
    <section id="contact" className="py-32 px-4 md:px-12 max-w-5xl mx-auto scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-6 flex items-center justify-center gap-4 tracking-tight">
          <span className="text-teal-400 font-display font-black text-2xl">06.</span> Get in touch
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Hiring, a project, or a question about something I wrote — type it below, or email{" "}
          <a href={`mailto:${EMAIL}`} className="text-teal-300 hover:underline">
            {EMAIL}
          </a>
          .
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-sm md:text-base relative"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="bg-white/5 border-b border-white/5 p-3 flex items-center justify-between">
          <div className="flex gap-2" aria-hidden="true">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="text-slate-400 text-xs flex items-center gap-2 uppercase tracking-widest opacity-80">
            <Terminal size={12} />
            <span>contact</span>
          </div>
          <span className="w-12" />
        </div>

        <div
          ref={containerRef}
          className="p-6 h-[380px] overflow-y-auto flex flex-col gap-2 cursor-text"
          aria-live="polite"
        >
          <div className="text-slate-500 mb-4 select-none leading-relaxed">
            $ ./contact
            <br />
            Enter your email, press Enter, then your message.
          </div>

          {lines.map((l, i) => (
            <div
              key={i}
              className={
                l.tone === "err"
                  ? "text-red-400"
                  : l.tone === "ok"
                    ? "text-emerald-400"
                    : l.tone === "muted"
                      ? "text-slate-500"
                      : "text-slate-400"
              }
            >
              {l.text}
            </div>
          ))}

          {(step === "email" || step === "message") && (
            <label className="flex items-center gap-2 text-teal-400">
              <span className="shrink-0">{step === "email" ? "> email:" : "> message:"}</span>
              <input
                ref={inputRef}
                type={step === "email" ? "email" : "text"}
                value={step === "email" ? email : message}
                onChange={(e) => (step === "email" ? setEmail(e.target.value) : setMessage(e.target.value))}
                onKeyDown={handleKeyDown}
                maxLength={step === "email" ? 200 : 2000}
                aria-label={step === "email" ? "Your email address" : "Your message"}
                className="bg-transparent border-none outline-none text-teal-50 flex-1 caret-teal-400 font-bold min-w-0"
                autoComplete={step === "email" ? "email" : "off"}
                spellCheck={step === "message"}
              />
            </label>
          )}

          {step === "sending" && (
            <div className="flex items-center gap-2 text-teal-400">
              <Loader2 size={16} className="animate-spin" />
              <span>sending…</span>
            </div>
          )}

          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-lg text-emerald-400 flex items-start gap-3"
            >
              <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">Delivered.</span>
                <span className="text-emerald-400/80 text-sm">
                  It&apos;s in my inbox. I&apos;ll reply to <span className="text-emerald-300">{email}</span>.
                </span>
              </div>
            </motion.div>
          )}

          {step === "undelivered" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 border border-amber-500/30 bg-amber-500/10 rounded-lg text-amber-300 flex items-start gap-3"
            >
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold block mb-1">This didn&apos;t reach me.</span>
                The site&apos;s mail service isn&apos;t connected right now. Your message is ready to send
                from your own email instead:
                <div className="mt-3">
                  <a
                    href={mailtoFor(email, message)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors"
                  >
                    <Mail size={15} /> Open in my email app
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <p className="mt-6 text-center text-sm text-slate-500 font-mono">
        Prefer email?{" "}
        <button onClick={copyEmail} className="text-slate-300 hover:text-teal-300 underline-offset-4 hover:underline">
          Copy {EMAIL}
        </button>
      </p>
    </section>
  );
}
