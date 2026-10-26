import { describe, expect, it } from "vitest";
import { posts } from "@/lib/posts";
import { sources } from "@/lib/sources";
import { works } from "@/lib/work";

// Source notes are the proof behind the hero numbers; a dead link there undoes the point.
describe("source notes", () => {
  const links = Object.values(sources).flatMap((s) => s.links.map((l) => l.href));

  it("link only to case studies and posts that exist", () => {
    for (const href of links) {
      const work = href.match(/^\/work\/(.+)$/)?.[1];
      const post = href.match(/^\/blog\/(.+)$/)?.[1];
      if (work) expect(works.map((w) => w.slug), href).toContain(work);
      else if (post) expect(posts.map((p) => p.slug), href).toContain(post);
      else expect(href, href).toMatch(/^\/#[a-z]+$/);
    }
  });

  it("gives every case study a unique slug", () => {
    expect(new Set(works.map((w) => w.slug)).size).toBe(works.length);
  });
});
