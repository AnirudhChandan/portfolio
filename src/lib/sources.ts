// Where each hero number comes from, shown by SourceNote. Facts mirror
// ~/assisstant/portfolio-in/FACTS.md; when the proof is private, the note says so instead of linking.
export type Source = { detail: string; links: { label: string; href: string }[] };

export const sources = {
  clinics: {
    detail:
      "From the healthcare platform's own architecture overview (July 2026). The platform is private, so there is no public link. I can walk you through my part of it on a call.",
    links: [],
  },
  nPlusOne: {
    detail: "A list page in a construction ERP went from 175 database queries to 12.",
    links: [
      { label: "How I found it", href: "/blog/n-plus-one" },
      { label: "Case study", href: "/work/construction-erp" },
    ],
  },
  cctv: {
    detail: "I installed it on the guard-room PC at Max Estates, Dehradun. Their guard team uses it every day.",
    links: [{ label: "Case study", href: "/work/max-estates" }],
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;
