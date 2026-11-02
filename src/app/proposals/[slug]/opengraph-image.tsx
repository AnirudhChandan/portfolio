import { blogOgImage, ogContentType, ogSize } from "@/components/blogOg";
import { proposals } from "@/lib/proposals";

export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return proposals.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = proposals.find((x) => x.slug === slug)!;
  return blogOgImage(p.title, p.field, "Sample proposal");
}
