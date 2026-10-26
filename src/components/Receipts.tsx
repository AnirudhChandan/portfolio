import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

// Every claim here links to something a visitor can check. Private client work says so
// instead of pretending to be public.
type Receipt = {
  kind: string;
  claim: string;
  detail: string;
  links: { label: string; href: string }[];
  badge?: { src: string; alt: string };
};

const receipts: Receipt[] = [
  {
    kind: "Public repo · CI",
    claim: "My database survives being killed mid-write",
    detail:
      "PyDB's test suite SIGKILLs a writer mid-workload and checks that no committed row is lost. CI runs it on every push.",
    links: [{ label: "github.com/AnirudhChandan/PyDB", href: "https://github.com/AnirudhChandan/PyDB" }],
    badge: {
      src: "https://github.com/AnirudhChandan/PyDB/actions/workflows/ci.yml/badge.svg",
      alt: "PyDB CI status",
    },
  },
  {
    kind: "Live in production",
    claim: "A guard team uses my dashboard every night",
    detail:
      "AI-CCTV alerts for Max Estates, Dehradun: 8 cameras on one screen, patrol compliance, installed on site by me and live since Sep 2026.",
    links: [{ label: "See the screens", href: "#work" }],
  },
  {
    kind: "Live client sites",
    claim: "Client websites you can open right now",
    detail:
      "A disability-support provider in Victoria built around accessibility, and a bilingual lead-generation site for a Bangkok agency.",
    links: [
      { label: "korareach.com.au", href: "https://korareach.com.au" },
      { label: "mvminfotech.com", href: "https://mvminfotech.com" },
    ],
  },
  {
    kind: "Runs in your browser",
    claim: "Systems you can poke, not just read about",
    detail:
      "A B+Tree with a pager and write-ahead log, a consistent-hash ring, and a rate limiter on a live edge route that returns real 429s.",
    links: [{ label: "Open the Lab", href: "/lab" }],
  },
  {
    kind: "Git history · private repo",
    claim: "711 of 1,100 commits on a 20-tenant ERP",
    detail:
      "A decade-old Java monolith to Spring Boot + React, 0 → 1,435 automated tests, worst pages from 15.6 s to 2.4 s. Client code is private; happy to walk through it on a call.",
    links: [{ label: "Read the N+1 write-up", href: "/blog/n-plus-one" }],
  },
  {
    kind: "Writing",
    claim: "Ten write-ups of real problems",
    detail:
      "What broke, why, and what fixed it, from a database that lost every committed write to row-level security that quietly switches itself off.",
    links: [{ label: "Read the blog", href: "/blog" }],
  },
];

export default function Receipts({ first }: { first?: string }) {
  // Lead with the receipt that matches the role page (serial-position effect).
  const ordered = first
    ? [...receipts.filter((r) => r.claim === first), ...receipts.filter((r) => r.claim !== first)]
    : receipts;
  return (
    <section id="proof" className="px-5 md:px-12 max-w-7xl mx-auto scroll-mt-28">
      <SectionHeader kicker="Proof" title="Receipts, not adjectives">
        Every claim on this site points at something you can check: a repo, a live system, a site, or a
        demo running in this page.
      </SectionHeader>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {ordered.map((r, i) => (
          <Reveal key={r.claim} delay={0.04 * i} className="h-full">
            <div className="rim-feather h-full rounded-2xl border border-white/[0.07] bg-slate-900/50 p-6 flex flex-col">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400">{r.kind}</span>
                {r.badge && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.badge.src} alt={r.badge.alt} className="h-5" loading="lazy" />
                )}
              </div>
              <h3 className="font-display font-bold text-lg text-slate-100 leading-snug mb-2">{r.claim}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">{r.detail}</p>
              <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2">
                {r.links.map((l) => {
                  const external = l.href.startsWith("http");
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex items-center gap-1 text-sm font-mono text-teal-400 hover:text-teal-300"
                    >
                      {l.label} <ArrowUpRight size={14} />
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
