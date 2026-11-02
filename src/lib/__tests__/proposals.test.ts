import { describe, expect, it } from "vitest";
import { posts } from "@/lib/posts";
import { proposals } from "@/lib/proposals";
import { works } from "@/lib/work";

// Each proposal stands on links to real work, so a dead link there undoes its point.
describe("sample proposals", () => {
  it("link only to case studies and posts that exist", () => {
    for (const p of proposals) {
      const links = [...p.basis, ...p.decisions.flatMap((d) => (d.proof ? [d.proof] : []))];
      expect(p.basis.length, p.slug).toBeGreaterThan(0);
      for (const { href } of links) {
        const work = href.match(/^\/work\/(.+)$/)?.[1];
        const post = href.match(/^\/blog\/(.+)$/)?.[1];
        if (work) expect(works.map((w) => w.slug), href).toContain(work);
        else if (post) expect(posts.map((x) => x.slug), href).toContain(post);
        else expect(href, href).toMatch(/^\/#[a-z]+$/);
      }
    }
  });

  it("gives every proposal a unique slug", () => {
    expect(new Set(proposals.map((p) => p.slug)).size).toBe(proposals.length);
  });
});
