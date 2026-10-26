import type { Metadata } from "next";
import { Mukta, Tiro_Devanagari_Hindi } from "next/font/google";
import { notFound } from "next/navigation";
import IndustryView from "@/components/IndustryView";
import { industries } from "@/lib/industries";

// Hindi fonts for the Hindi view only; not preloaded, so English readers never download them.
const tiro = Tiro_Devanagari_Hindi({ subsets: ["devanagari"], weight: "400", variable: "--font-tiro", preload: false });
const mukta = Mukta({ subsets: ["devanagari"], weight: ["400", "600"], variable: "--font-mukta", preload: false });

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) return {};
  return {
    title: ind.seoTitle,
    description: ind.seoDescription,
    alternates: { canonical: `/for-business/${ind.slug}` },
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) notFound();
  return (
    <div className={`${tiro.variable} ${mukta.variable}`}>
      <IndustryView industry={ind} />
    </div>
  );
}
