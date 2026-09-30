import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { posts } from "@/lib/posts";

const blogDir = join(__dirname, "..", "..", "app", "blog");

// posts.ts drives the index, the home teaser, prev/next links and the sitemap,
// so a slug without a page is a broken link in four places at once.
describe("blog posts", () => {
  it("has a page and a social image for every post", () => {
    for (const p of posts) {
      expect(existsSync(join(blogDir, p.slug, "page.tsx")), `${p.slug}/page.tsx`).toBe(true);
      expect(existsSync(join(blogDir, p.slug, "opengraph-image.tsx")), `${p.slug}/opengraph-image.tsx`).toBe(true);
    }
  });

  it("has unique slugs", () => {
    expect(new Set(posts.map((p) => p.slug)).size).toBe(posts.length);
  });
});
