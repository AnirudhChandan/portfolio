"use client";

import Image from "next/image";
import Link from "next/link";
import type { Industry } from "@/lib/industries";
import { WHATSAPP_URL } from "@/lib/contact";
import { track } from "@/lib/track";

type Lang = "en" | "hi";
const ui = {
  back: { en: "Home", hi: "होम" },
  offers: { en: "What I build for you", hi: "मैं आपके लिए क्या बनाता हूँ" },
  proof: { en: "Already running", hi: "पहले से चल रहा है" },
  promise: { en: "What you can count on", hi: "आप किस बात पर भरोसा कर सकते हैं" },
  promises: {
    en: [
      "A written plan with stages and dates before you pay",
      "Pay stage by stage, after each one works",
      "You own the code, the data and the accounts",
    ],
    hi: [
      "पैसा देने से पहले लिखित प्लान, स्टेज और तारीखों के साथ",
      "हर स्टेज चलता देखकर, स्टेज-दर-स्टेज भुगतान",
      "कोड, डेटा और अकाउंट आपके नाम पर",
    ],
  },
  ctaTitle: { en: "Tell me what's slow, manual or breaking.", hi: "बताइए क्या धीमा है, हाथ से होता है या बार-बार बिगड़ता है।" },
  ctaBody: {
    en: "I reply within 24 hours and tell you honestly whether software fixes it.",
    hi: "मैं 24 घंटे में जवाब देता हूँ और सच बताता हूँ कि सॉफ़्टवेयर से हल होगा या नहीं।",
  },
  whatsapp: { en: "Message on WhatsApp", hi: "WhatsApp पर मैसेज करें" },
  call: { en: "Book a free call", hi: "मुफ़्त कॉल बुक करें" },
};

export default function IndustryView({ industry, lang }: { industry: Industry; lang: Lang }) {
  const t = (b: { en: string; hi: string }) => b[lang];
  const heading = "font-display font-bold text-2xl text-slate-50 mb-4";

  return (
    <main lang={lang === "hi" ? "hi" : "en"} className="min-h-screen pt-32 pb-28">
      <div className="max-w-2xl mx-auto px-5">
        <div className="flex items-center justify-between gap-4 mb-10">
          <Link href="/#services" className="text-sm text-slate-500 hover:text-teal-400">
            ← {t(ui.back)}
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

        <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-50 tracking-tight leading-tight mb-5">
          {t(industry.title)}
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed mb-12">{t(industry.problem)}</p>

        <h2 className={heading}>{t(ui.offers)}</h2>
        <ul className="space-y-3 mb-12 text-lg text-slate-300 leading-relaxed list-disc pl-5 marker:text-teal-400">
          {industry.offers.map((o) => (
            <li key={o.en}>{t(o)}</li>
          ))}
        </ul>

        <h2 className={heading}>{t(ui.proof)}</h2>
        <ul className="space-y-3 mb-8 text-lg text-slate-300 leading-relaxed list-disc pl-5 marker:text-teal-400">
          {industry.proof.map((p) => (
            <li key={p.en}>{t(p)}</li>
          ))}
        </ul>
        {industry.image && (
          <figure className="mb-12">
            <Image
              src={industry.image.src}
              alt={industry.image.alt}
              width={industry.image.width}
              height={industry.image.height}
              className="rounded-xl border border-white/[0.07]"
              sizes="(min-width: 672px) 42rem, 100vw"
            />
            <figcaption className="text-sm text-slate-500 mt-2">Demo data, not residents&apos; records.</figcaption>
          </figure>
        )}

        <h2 className={`${heading} mt-12`}>{t(ui.promise)}</h2>
        <ul className="space-y-3 mb-12 text-lg text-slate-300 leading-relaxed list-disc pl-5 marker:text-teal-400">
          {ui.promises[lang].map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <div className="pt-10 border-t border-white/[0.07]">
          <h2 className={heading}>{t(ui.ctaTitle)}</h2>
          <p className="text-lg text-slate-400 leading-relaxed mb-6">{t(ui.ctaBody)}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { from: `industry:${industry.slug}`, lang })}
              className="rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-teal-400"
            >
              {t(ui.whatsapp)}
            </a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/5"
            >
              {t(ui.call)}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
