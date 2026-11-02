"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { audiences, type Audience } from "@/lib/audience";
import { track } from "@/lib/track";

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
  ];

  const summary =
    `Anirudh Chandan: ${a.role}, 2.5+ years (since Feb 2024). ` +
    "Node.js/TypeScript and Python on PostgreSQL; APIs for a healthcare platform used by 2,300+ clinics, " +
    "711 of 1,100 commits modernising a 20-tenant ERP (15.6s → 2.4s), a CCTV dashboard live on site since Sep 2026. " +
    `Remote from India. Résumé: https://anirudhchandan.com${a.resume}`;

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
    <section id="hiring" className="max-w-4xl mx-auto w-full px-5 md:px-8 scroll-mt-28">
      <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-50 tracking-tight mb-6">The screening answers</h2>
      <dl className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {rows.map((r) => (
          <div key={r.k} className="grid sm:grid-cols-[9rem_minmax(0,1fr)] gap-x-6 gap-y-0.5 py-3">
            <dt className="text-sm text-slate-500">{r.k}</dt>
            <dd className="text-slate-200">{r.v}</dd>
          </div>
        ))}
      </dl>
      <button onClick={copy} className="inline-flex items-center gap-2 mt-6 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/5">
        {copied ? <Check size={16} className="text-teal-400" /> : <Copy size={16} />}
        {copied ? "Copied" : "Copy a 3-line summary"}
      </button>
    </section>
  );
}
