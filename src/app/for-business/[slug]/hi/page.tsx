import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IndustryView from "@/components/IndustryView";
import { industries } from "@/lib/industries";

// The Hindi version has its own address, so it can be sent on WhatsApp and opens in Hindi.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) return {};
  return {
    title: ind.title.hi,
    description: ind.problem.hi,
    alternates: {
      canonical: `/for-business/${ind.slug}/hi`,
      languages: { en: `/for-business/${ind.slug}`, hi: `/for-business/${ind.slug}/hi` },
    },
    openGraph: { locale: "hi_IN", title: ind.title.hi, description: ind.problem.hi },
  };
}

export default async function IndustryPageHindi({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) notFound();
  return <IndustryView industry={ind} lang="hi" />;
}
