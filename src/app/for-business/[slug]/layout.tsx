import type { ReactNode } from "react";
import { Mukta, Tiro_Devanagari_Hindi } from "next/font/google";
import { industries } from "@/lib/industries";

// Shared by /for-business/<slug> (English) and /for-business/<slug>/hi (Hindi).
// Hindi fonts are not preloaded, so English readers never download them.
const tiro = Tiro_Devanagari_Hindi({ subsets: ["devanagari"], weight: "400", variable: "--font-tiro", preload: false });
const mukta = Mukta({ subsets: ["devanagari"], weight: ["400", "600"], variable: "--font-mukta", preload: false });

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}
export const dynamicParams = false;

export default function IndustryLayout({ children }: { children: ReactNode }) {
  return <div className={`${tiro.variable} ${mukta.variable}`}>{children}</div>;
}
