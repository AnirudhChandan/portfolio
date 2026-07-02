import { blogOgImage, ogAlt, ogContentType, ogSize } from "@/components/blogOg";
import { posts } from "@/lib/posts";

const post = posts.find((p) => p.slug === "killing-polling")!;

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = ogAlt(post.title);

export default function Image() {
  return blogOgImage(post.title, post.tag);
}
