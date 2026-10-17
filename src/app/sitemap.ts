import type { MetadataRoute } from "next";
import { posts } from "@/lib/posts";
import { industries } from "@/lib/industries";

const SITE = "https://anirudh-chandan.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/lab`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/now`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/checklist`, changeFrequency: "yearly", priority: 0.6 },
    ...industries.map((i) => ({ url: `${SITE}/for-business/${i.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...posts.map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
