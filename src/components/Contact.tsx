"use client";

import { EMAIL, WHATSAPP_URL } from "@/lib/contact";
import { track } from "@/lib/track";

export default function Contact() {
  return (
    <section id="contact" className="max-w-4xl mx-auto w-full px-5 md:px-8 scroll-mt-28">
      <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-50 tracking-tight mb-4">Get in touch</h2>
      <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
        Tell me about the role, or what is slow, manual or breaking in your business. I reply within 24 hours.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { from: "contact" })}
          className="rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-teal-400"
        >
          Message on WhatsApp
        </a>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
          className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/5"
        >
          Book a free call
        </button>
        <a
          href={`mailto:${EMAIL}`}
          onClick={() => track("email_click", { from: "contact" })}
          className="px-2 py-3 text-sm text-slate-300 hover:text-teal-400"
        >
          {EMAIL}
        </a>
      </div>
    </section>
  );
}
