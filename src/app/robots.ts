import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://anirudhchandan.com/sitemap.xml",
    host: "https://anirudhchandan.com",
  };
}
