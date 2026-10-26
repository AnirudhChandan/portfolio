"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import type { Industry } from "@/lib/industries";
import { WHATSAPP_URL } from "@/lib/contact";
import { track } from "@/lib/track";

type Lang = "en" | "hi";
const ui = {
  back: { en: "Home", hi: "होम" },
  kicker: { en: "Software for your business", hi: "आपके कारोबार के लिए सॉफ़्टवेयर" },
  offers: { en: "What I build for you", hi: "मैं आपके लिए क्या बनाता हूँ" },
  proof: { en: "Already running", hi: "पहले से चल रहा है" },
  promise: { en: "What you can count on", hi: "आप किस बात पर भरोसा कर सकते हैं" },
  promises: {
    en: [
      "Free first call or site visit",
      "A written plan with stages and dates before you pay",
      "Pay stage by stage, after each one works",
      "You own the code, the data and the accounts",
      "Training in Hindi or English; support after go-live",
    ],
    hi: [
      "पहली कॉल या साइट विज़िट मुफ़्त",
      "पैसा देने से पहले लिखित प्लान, स्टेज और तारीखों के साथ",
      "हर स्टेज चलता देखकर, स्टेज-दर-स्टेज भुगतान",
      "कोड, डेटा और अकाउंट आपके नाम पर",
      "हिंदी या अंग्रेज़ी में ट्रेनिंग; चालू होने के बाद भी सपोर्ट",
    ],
  },
  ctaTitle: { en: "Tell me what's slow, manual or breaking.", hi: "बताइए क्या धीमा है, हाथ से होता है या बार-बार बिगड़ता है।" },
  ctaBody: {
    en: "I reply within 24 hours and tell you honestly whether software fixes it.",
    hi: "मैं 24 घंटे में जवाब देता हूँ और सच बताता हूँ कि सॉफ़्टवेयर से हल होगा या नहीं।",
  },
  whatsapp: { en: "Message on WhatsApp", hi: "WhatsApp पर मैसेज करें" },
  call: { en: "Book a free call", hi: "मुफ़्त कॉल बुक करें" },
  checklist: { en: "12 questions to ask before you hire any developer →", hi: "किसी भी डेवलपर को रखने से पहले पूछने लायक 12 सवाल (अंग्रेज़ी) →" },
};

export default function IndustryView({ industry, lang }: { industry: Industry; lang: Lang }) {
  const t = (b: { en: string; hi: string }) => b[lang];

  return (
    <main lang={lang === "hi" ? "hi" : "en"} className="min-h-screen pt-32 pb-28">
      <div className="max-w-5xl mx-auto px-5 md:px-12">
        <div className="flex items-center justify-between gap-4 mb-10">
          <Link href="/#services" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-400 font-mono text-sm">
            <ArrowLeft size={16} /> {t(ui.back)}
          </Link>
          {/* Each language has its own address, so either version can be shared as a link. */}
          <nav aria-label="Language" className="inline-flex rounded-full border border-white/10 p-0.5 text-sm">
            {(["en", "hi"] as Lang[]).map((l) => (
              <Link
                key={l}
                href={`/for-business/${industry.slug}${l === "hi" ? "/hi" : ""}`}
                hrefLang={l}
                lang={l}
                aria-current={lang === l ? "page" : undefined}
                className={`px-3 py-1 rounded-full ${lang === l ? "bg-teal-500 text-slate-950 font-semibold" : "text-slate-400 hover:text-slate-100"}`}
              >
                {l === "en" ? "English" : "हिंदी"}
              </Link>
            ))}
          </nav>
        </div>

        <div className="text-xs font-mono uppercase tracking-[0.25em] text-teal-400 mb-4">{t(ui.kicker)}</div>
        <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-50 tracking-tight leading-tight mb-6">
          {t(industry.title)}
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mb-14">{t(industry.problem)}</p>

        <h2 className="font-display font-bold text-2xl text-slate-50 mb-5">{t(ui.offers)}</h2>
        <ul className="grid md:grid-cols-2 gap-4 mb-14">
          {industry.offers.map((o) => (
            <li key={o.en} className="rounded-2xl border border-white/[0.07] bg-slate-900/50 p-5 flex gap-3 text-slate-300 leading-relaxed">
              <Check size={18} className="text-teal-400 shrink-0 mt-1" />
              {t(o)}
            </li>
          ))}
        </ul>

        <h2 className="font-display font-bold text-2xl text-slate-50 mb-5">{t(ui.proof)}</h2>
        <div className="space-y-3 mb-8">
          {industry.proof.map((p) => (
            <p key={p.en} className="border-l-2 border-teal-500/60 pl-4 text-slate-300 leading-relaxed">{t(p)}</p>
          ))}
        </div>
        {industry.image && (
          <figure className="mb-14">
            <Image
              src={industry.image.src}
              alt={industry.image.alt}
              width={industry.image.width}
              height={industry.image.height}
              className="rounded-2xl border border-white/[0.07]"
              sizes="(min-width: 1024px) 64rem, 100vw"
            />
            <figcaption className="text-xs text-slate-500 mt-2">Demo data, not residents&apos; records.</figcaption>
          </figure>
        )}

        <div className="rounded-2xl border border-white/[0.07] bg-slate-900/50 p-6 md:p-8 mb-10">
          <h2 className="font-display font-semibold text-lg text-slate-100 mb-4">{t(ui.promise)}</h2>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
            {ui.promises[lang].map((p) => (
              <li key={p} className="flex gap-3 text-sm text-slate-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-teal-500/20 bg-teal-500/[0.06] p-6 md:p-8">
          <div className="font-display font-bold text-xl text-slate-50">{t(ui.ctaTitle)}</div>
          <p className="text-slate-400 text-sm mt-1 mb-5">{t(ui.ctaBody)}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { from: `industry:${industry.slug}`, lang })}
              className="px-5 py-3 bg-teal-500 text-slate-950 font-semibold rounded-xl hover:bg-teal-400 inline-flex items-center gap-2 text-sm"
            >
              <MessageCircle size={16} /> {t(ui.whatsapp)}
            </a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
              className="px-5 py-3 border border-white/10 text-slate-100 font-semibold rounded-xl hover:bg-white/5 inline-flex items-center gap-2 text-sm"
            >
              {t(ui.call)} <ArrowRight size={16} />
            </button>
          </div>
          <Link href="/checklist" className="inline-block mt-5 text-sm text-teal-400 hover:text-teal-300">
            {t(ui.checklist)}
          </Link>
        </div>
      </div>
    </main>
  );
}
