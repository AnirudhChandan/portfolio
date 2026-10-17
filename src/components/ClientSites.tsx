import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

// Same list as the India portfolio. Only domains verified to serve the client's site are linked.
const sites = [
  { name: "Kora Reach", where: "Victoria, Australia", status: "Live", url: "https://korareach.com.au",
    what: "Disability support, so accessibility was the design: low-stim mode, persistent text sizing, text-to-speech, an eligibility quiz." },
  { name: "MVM Infotech", where: "Bangkok, Thailand", status: "Live", url: "https://mvminfotech.com",
    what: "A lead machine: visitors run a free live audit of their own site, configure a quote, and get invited back if they leave. English and Thai." },
  { name: "Divine Vikas", where: "India", status: "Live",
    what: "Paid workshop bookings where two people can't buy the same seat: instant locks, abandoned checkouts released, payment confirmed server-side." },
  { name: "madhūka NATURELLE", where: "India", status: "Delivered",
    what: "Full D2C commerce with subscriptions and referrals, plus batch provenance: scan the jar, see the hive and harvest." },
  { name: "UVA Astrology", where: "India", status: "Delivered",
    what: "A real astronomy engine underneath, not lookup tables, driving seven calculation services with booking on top." },
  { name: "BalaG Studios", where: "Rishikesh", status: "Delivered",
    what: "A golden-hour calculator for a couple's date and venue, a colour-grade slider, link previews tuned for WhatsApp." },
  { name: "Gharwale", where: "India", status: "Delivered",
    what: "Static-first for mobile data, with a cost estimator that qualifies leads before they reach the phone." },
  { name: "Raaha Wellbeing", where: "United Kingdom", status: "Delivered",
    what: "The practitioner publishes articles herself through a proper editing dashboard; handed over with a plain-English guide." },
  { name: "KSP Group", where: "Melbourne", status: "In build",
    what: "Reads like an architectural drawing set; 348 KB, no dependencies, and a pricer that pre-fills the enquiry." },
  { name: "Corporate law firm", where: "Dehradun", status: "In build",
    what: "Free tools that answer a client's first question before the call, written inside the Bar Council's no-advertising rule." },
];

export default function ClientSites() {
  return (
    <div className="mt-16">
      <Reveal>
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h3 className="font-display font-bold text-2xl text-slate-50 tracking-tight">Websites that do a job</h3>
          <span className="text-sm text-slate-500">10 clients · India, Australia, UK, Thailand</span>
        </div>
      </Reveal>
      <Reveal>
        <ul className="rounded-2xl border border-white/[0.07] divide-y divide-white/[0.07] bg-slate-900/30">
          {sites.map((s) => (
            <li key={s.name} className="grid md:grid-cols-[14rem_1fr_6rem] gap-x-6 gap-y-1 px-5 md:px-6 py-4">
              <div>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-1 font-display font-semibold text-slate-100 hover:text-teal-400">
                    {s.name} <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <span className="font-display font-semibold text-slate-100">{s.name}</span>
                )}
                <div className="text-xs text-slate-500">{s.where}</div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{s.what}</p>
              <div className="md:text-right">
                <span className={`text-[11px] font-mono ${s.status === "Live" ? "text-teal-400" : "text-slate-500"}`}>
                  {s.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
