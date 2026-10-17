"use client";

import { Calendar, Check, Copy, FileText, Mail } from "lucide-react";
import { useState } from "react";
import { audiences, type Audience } from "@/lib/audience";
import { track } from "@/lib/track";
import Reveal from "./Reveal";

// Every screening question a recruiter asks, answered in one block (Hick's law: one place, few choices).
// Notice period and start date stay off the public site on purpose.
export default function RecruiterCard({ audience }: { audience: Audience }) {
  const a = audiences[audience];
  const [copied, setCopied] = useState(false);

  const rows = [
    { k: "Role", v: a.role },
    { k: "Experience", v: "2.5+ years, professional since Feb 2024" },
    { k: "Core stack", v: "Node.js, TypeScript, Python (FastAPI, Flask), Java / Spring Boot, PostgreSQL, Redis, Kafka, AWS / GCP" },
    { k: "Where", v: "India (IST), remote; flexible overlap with EU and US hours" },
    { k: "Domains", v: "Healthcare SaaS, multi-tenant ERP, document workflows, CCTV / IoT integration" },
    { k: "Start date", v: "Notice period and start date on request" },
  ];

  const summary =
    `Anirudh Chandan: ${a.role}, 2.5+ years (since Feb 2024). ` +
    "Node.js/TypeScript and Python on PostgreSQL; APIs for a healthcare platform used by 2,300+ clinics, " +
    "711 of 1,100 commits modernising a 20-tenant ERP (15.6s → 2.4s), a CCTV dashboard live on site since Sep 2026. " +
    `Remote from India. Résumé: https://anirudh-chandan.vercel.app${a.resume}`;

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(summary);
      ok = true;
    } catch {
      // Clipboard API blocked (permissions, unfocused frame): fall back to a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = summary;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      ok = document.execCommand("copy");
      ta.remove();
    }
    if (!ok) return;
    setCopied(true);
    track("summary_copy", { audience });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="hiring" className="px-5 md:px-12 max-w-7xl mx-auto scroll-mt-28">
      <Reveal>
        <div className="rounded-3xl border border-white/[0.07] bg-slate-900/50 p-6 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="lg:max-w-3xl w-full">
              <div className="text-xs font-mono uppercase tracking-[0.25em] text-teal-400 mb-3">For recruiters</div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-50 tracking-tight mb-6">
                The screening answers, in one place
              </h2>
              <dl className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
                {rows.map((r) => (
                  <div key={r.k} className="grid sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-0.5 py-3">
                    <dt className="text-sm text-slate-500">{r.k}</dt>
                    <dd className="text-sm md:text-[15px] text-slate-200">{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col gap-3 lg:w-64 shrink-0">
              <a
                href={a.resume}
                target="_blank"
                onClick={() => track("resume_download", { audience })}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-teal-400"
              >
                <FileText size={16} /> Download résumé
              </a>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-white/5"
              >
                <Calendar size={16} /> Book a 30-min call
              </button>
              <button
                onClick={copy}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-white/5"
              >
                {copied ? <Check size={16} className="text-teal-400" /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy a 3-line summary"}
              </button>
              <a
                href="mailto:anichandan124@gmail.com"
                onClick={() => track("email_click", { from: "recruiter_card" })}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-slate-100"
              >
                <Mail size={15} /> anichandan124@gmail.com
              </a>
              <p className="text-xs text-slate-500 leading-relaxed">
                The summary is ready to paste into your ATS or a hiring-manager message.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
