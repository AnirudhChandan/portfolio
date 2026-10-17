"use client";

import { ArrowRight, Boxes, Camera, Gauge, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/contact";
import { industries } from "@/lib/industries";
import { track } from "@/lib/track";
import ClientFAQ from "./ClientFAQ";
import ClientSites from "./ClientSites";
import Testimonials from "./Testimonials";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const services = [
  {
    icon: Boxes,
    title: "Custom software & dashboards",
    desc: "Internal tools, ERPs and document workflows shaped around how your team actually works.",
  },
  {
    icon: Camera,
    title: "CCTV, IoT & hardware integration",
    desc: "Camera boxes, gate readers and QR passes brought onto one screen your staff can use.",
  },
  {
    icon: Gauge,
    title: "Backend performance & reliability",
    desc: "Audit first, then fix in order of payoff: N+1 queries, slow pages, tenant isolation, deploys.",
  },
  {
    icon: Sparkles,
    title: "AI with a human in the loop",
    desc: "Documents into data, answers from your own records. The AI reads, code checks, a person confirms.",
  },
];

// Risk reversal: the reasons a client fears hiring a freelancer, removed one by one.
const guarantees = [
  "A written plan with scope, stages and dates before you pay anything",
  "You pay stage by stage, after you've seen each stage working",
  "You own the code, the data and every account, in your name",
  "Tests and plain-language notes at every stage, so nobody is locked in",
  "Support after go-live, and a straight answer if software isn't the fix",
];

const steps = [
  { t: "Call or site visit", d: "What are you actually trying to fix? No charge." },
  { t: "Written plan", d: "Scope, stages, timeline and risks in writing before work starts." },
  { t: "Build in stages", d: "Working software every week, not a reveal at the end." },
  { t: "Install & train", d: "On your premises or your cloud; training in Hindi or English." },
  { t: "Support", d: "Remote support after go-live, and a retainer if you want one." },
];

export default function Services() {
  return (
    <section id="services" className="px-5 md:px-12 max-w-7xl mx-auto scroll-mt-28">
      <SectionHeader kicker="Need something built?" title="Freelance & contract work">
        I build the software a business runs on, from dashboards and integrations to websites, and I build
        it to keep working after I hand it over. Based in India; on site in Uttarakhand and Delhi NCR, remote
        for teams anywhere.
      </SectionHeader>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={0.04 * i} className="h-full">
            <div className="h-full rounded-2xl border border-white/[0.07] bg-slate-900/50 p-6">
              <s.icon size={22} className="text-teal-400 mb-4" />
              <h3 className="font-display font-bold text-lg text-slate-100 mb-2 leading-snug">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-6 border-t border-white/[0.07] pt-10">
          {steps.map((s, i) => (
            <li key={s.t}>
              <div className="font-mono text-xs text-teal-400 mb-2">0{i + 1}</div>
              <div className="font-display font-semibold text-slate-100 mb-1">{s.t}</div>
              <p className="text-sm text-slate-400 leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal>
        <div className="mt-12 rounded-2xl border border-white/[0.07] bg-slate-900/50 p-6 md:p-8">
          <div className="flex items-center gap-2 text-teal-400 mb-4">
            <ShieldCheck size={20} />
            <span className="font-display font-semibold text-slate-100 text-lg">What you can count on</span>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
            {guarantees.map((g) => (
              <li key={g} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <span className="text-slate-500">Built for:</span>
          {industries.map((ind) => (
            <a key={ind.slug} href={`/for-business/${ind.slug}`} className="rounded-full border border-white/10 px-3 py-1 text-slate-300 hover:border-teal-500/40 hover:text-teal-400">
              {ind.short}
            </a>
          ))}
        </div>
      </Reveal>

      <ClientSites />
      <Testimonials />
      <ClientFAQ />

      <Reveal>
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl border border-teal-500/20 bg-teal-500/[0.06] p-6 md:p-8">
          <div>
            <div className="font-display font-bold text-xl text-slate-50">Send me the problem, not the spec.</div>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Tell me what&apos;s slow, manual or breaking. I reply within 24 hours and say honestly whether
              software fixes it. Not ready to talk?{" "}
              <a href="/checklist" className="text-teal-400 hover:text-teal-300">
                12 questions to ask before you hire any developer, including me →
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { from: "services" })}
              className="px-5 py-3 bg-teal-500 text-slate-950 font-semibold rounded-xl hover:bg-teal-400 transition-colors inline-flex items-center gap-2 text-sm"
            >
              <MessageCircle size={16} /> Message on WhatsApp
            </a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
              className="px-5 py-3 border border-white/10 text-slate-100 font-semibold rounded-xl hover:bg-white/5 transition-colors inline-flex items-center gap-2 text-sm"
            >
              Book a free call <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
