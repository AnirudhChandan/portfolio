import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePage from "@/components/HomePage";
import Feather from "@/components/Feather";
import FooterPeacock from "@/components/FooterPeacock";
import { ROLES, audiences, type Audience } from "@/lib/audience";

// Static role-framed copies of the home page, for pasting into applications: /for/ai, /for/fde …
export function generateStaticParams() {
  return ROLES.map((role) => ({ role }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role } = await params;
  const a = audiences[role as Audience];
  return {
    title: a?.role,
    description: a?.headline,
    alternates: { canonical: "/" },
  };
}

export default async function RolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!(ROLES as readonly string[]).includes(role)) notFound();
  return <HomePage audience={role as Audience} feather={<Feather />} peacock={<FooterPeacock />} />;
}
