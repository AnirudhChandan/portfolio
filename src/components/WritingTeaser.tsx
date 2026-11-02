import Link from "next/link";
import { posts } from "@/lib/posts";

// The three newest posts, straight from the same list the blog index renders.
export default function WritingTeaser() {
  return (
    <section id="writing" className="max-w-4xl mx-auto w-full px-5 md:px-8 scroll-mt-28">
      <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-50 tracking-tight mb-4">Writing</h2>
      <p className="text-lg text-slate-400 leading-relaxed mb-6">Real problems: what broke, why, and what fixed it.</p>
      <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {posts.slice(0, 3).map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="block py-4 font-display font-bold text-lg text-slate-100 hover:text-teal-400 transition-colors">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/blog" className="inline-block mt-6 text-teal-400 hover:text-teal-300">
        All {posts.length} posts →
      </Link>
    </section>
  );
}
