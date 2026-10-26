// Where each hero number comes from, shown by SourceNote. Facts mirror
// ~/assisstant/portfolio-in/FACTS.md; when the proof is private, the note says so instead of linking.
export type Source = { claim: string; detail: string; links: { label: string; href: string }[] };

export const sources = {
  clinics: {
    claim: "2,300+ clinic tenants",
    detail:
      "From the healthcare platform's own architecture overview (July 2026): about 2,300 clinic tenants and 921k patient records. The platform is private, so there is no public link. I can walk you through my part of it on a call.",
    links: [{ label: "My role there", href: "/#experience" }],
  },
  erp: {
    claim: "711 of 1,100 commits",
    detail:
      "Counted from the git history of a construction ERP used by about 20 companies, where I am also the only person who ships releases. The client's code is private; I can share my screen and show the log on a call.",
    links: [{ label: "Case study", href: "/work/construction-erp" }],
  },
  nPlusOne: {
    claim: "15.6s → 2.4s",
    detail:
      "One page of the same ERP, the material reservations list, went from 175 database queries to 12. I checked all 53 list screens for the same mistake before fixing any of them.",
    links: [
      { label: "How I found it", href: "/blog/n-plus-one" },
      { label: "Case study", href: "/work/construction-erp" },
    ],
  },
  cctv: {
    claim: "Live since Sep 2026",
    detail:
      "I installed the CCTV alert dashboard on the guard-room PC at Max Estates, Dehradun, in September 2026. Their guard team has used it every day since.",
    links: [{ label: "Screens and case study", href: "/work/max-estates" }],
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;
