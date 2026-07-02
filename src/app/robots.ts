import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://anirudh-chandan.vercel.app/sitemap.xml",
    host: "https://anirudh-chandan.vercel.app",
  };
}
