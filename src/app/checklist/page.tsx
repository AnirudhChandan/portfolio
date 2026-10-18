import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = {
  title: "12 questions to ask before you hire a developer",
  description:
    "A free checklist for business owners hiring a software developer or agency: plans, payments, ownership, support, and the questions that separate a safe hire from an expensive one.",
};

// Reciprocity lead magnet: useful whoever the reader hires. Printable; no email gate.
const questions: { q: string; why: string }[] = [
  { q: "Will I get a written plan with scope, stages and dates before I pay?", why: "If it isn't written down, you can't hold anyone to it, and neither of you will remember the same thing in a month." },
  { q: "How do I pay?", why: "Pay in stages tied to working software you have seen. Paying everything upfront removes your only leverage." },
  { q: "Do I own the code, the data and every account?", why: "Domain, hosting, app-store listing and code repository should be in your name from day one, not the developer's." },
  { q: "Can I see something working every week?", why: "Weekly demos catch misunderstandings while they're cheap to fix. A big reveal at the end is where projects go wrong." },
  { q: "Can you show me something you've built that is live today?", why: "A link you can open or a site you can visit is worth more than screenshots or a list of technologies." },
  { q: "What went wrong on a past project, and what did you change?", why: "Every real project has problems. Someone who can't name one is either new or not being straight with you." },
  { q: "Where will my data live, and who can see it?", why: "Especially for customer, patient or resident data: know the server, the country, and who has access." },
  { q: "What will it cost to run each month?", why: "Hosting, SMS credits and app-store fees continue after the build. Get them in writing before you start." },
  { q: "What happens if you become unavailable?", why: "Ask for documentation and automated tests at every stage, so another developer could take over without starting again." },
  { q: "Who trains my staff, and in what language?", why: "Software your staff can't use is wasted. Training should happen on your premises, in the language they think in." },
  { q: "What support do I get after go-live, and what does it cost?", why: "Agree how bugs are reported, how fast they're answered, and what counts as a change versus a fix." },
  { q: "Is software actually the fix?", why: "Sometimes a process change or a tool you already pay for is cheaper. A good developer will tell you when you don't need them." },
];

export default function ChecklistPage() {
  return (
    <main className="min-h-screen pt-32 pb-28 print:pt-0 print:pb-0">
      <div className="max-w-3xl mx-auto px-5 md:px-12">
        <div className="flex items-center justify-between gap-4 mb-10 print:hidden">
          <Link href="/#services" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-400 font-mono text-sm">
            <ArrowLeft size={16} /> Home
          </Link>
          <PrintButton />
        </div>
        <div className="text-xs font-mono uppercase tracking-[0.25em] text-teal-400 mb-4">Free checklist</div>
        <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-50 tracking-tight leading-tight mb-4">
          12 questions to ask before you hire a developer
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed mb-12">
          Ask these of anyone you&apos;re thinking of hiring, including me. Good answers are short and specific;
          vague ones are your warning.
        </p>
        <ol className="space-y-7">
          {questions.map((x, i) => (
            <li key={x.q} className="grid grid-cols-[2.5rem_1fr] gap-x-2 break-inside-avoid">
              <span className="font-mono text-sm text-teal-400 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="font-display font-semibold text-lg text-slate-100 leading-snug mb-1">{x.q}</h2>
                <p className="text-slate-400 leading-relaxed">{x.why}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-14 border-t border-white/10 pt-6 text-sm text-slate-500">
          From Anirudh Chandan, software developer · anirudhchandan.com · WhatsApp +91 97604 55011
        </p>
      </div>
    </main>
  );
}
