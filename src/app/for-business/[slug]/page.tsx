import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IndustryView from "@/components/IndustryView";
import { industries } from "@/lib/industries";

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
  return <IndustryView industry={ind} />;
}
