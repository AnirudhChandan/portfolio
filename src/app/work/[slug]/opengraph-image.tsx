import { blogOgImage, ogContentType, ogSize } from "@/components/blogOg";
import { works } from "@/lib/work";

export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = works.find((x) => x.slug === slug)!;
  return blogOgImage(w.title, w.status, "Case study");
}
