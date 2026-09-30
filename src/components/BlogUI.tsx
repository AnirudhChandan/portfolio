import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { posts } from "@/lib/posts";

// Shared, server-rendered building blocks for blog articles.

export function Code({ children }: { children: string }) {
  return (
    <pre className="my-6 overflow-x-auto rounded-xl border border-white/5 bg-[#020408] p-4 text-[13px] leading-relaxed font-mono text-slate-300">
      <code>{children}</code>
    </pre>
  );
}

// Inline code inside prose.
export function C({ children }: { children: ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-slate-800/70 border border-white/5 text-[0.9em] text-teal-200 font-mono">
      {children}
    </code>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return <div className="text-slate-300 text-lg leading-relaxed space-y-6">{children}</div>;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-100 tracking-tight mb-5">
        {title}
      </h2>
      <div className="text-slate-300 text-lg leading-relaxed space-y-5">{children}</div>
    </section>
  );
}

// Title, tag, date and reading time come from src/lib/posts.ts, so the index,
// the article header, the home-page teaser and the sitemap can never disagree.
export function ArticleLayout({ slug, children }: { slug: string; children: ReactNode }) {
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) throw new Error(`ArticleLayout: no post "${slug}" in src/lib/posts.ts`);
  const post = posts[i];
  const newer = posts[i - 1];
  const older = posts[i + 1];

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-32">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-400 transition-colors font-mono text-sm mb-12"
      >
        <ArrowLeft size={16} /> Writing
      </Link>

      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-5">
        <span className="text-teal-400">{post.tag}</span>
        <span>{post.date}</span>
        <span className="flex items-center gap-1">
          <Clock size={12} /> {post.read}
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl font-display font-black text-slate-100 tracking-tighter leading-tight mb-8">
        {post.title}
      </h1>

      <article>{children}</article>

      <footer className="mt-20 pt-10 border-t border-white/5">
        <p className="text-slate-400 leading-relaxed">
          I&apos;m Anirudh, a backend engineer in Bengaluru. I write about problems I&apos;ve had to
          solve for real.{" "}
          <Link href="/#contact" className="text-teal-300 hover:underline">
            Say hello
          </Link>{" "}
          or{" "}
          <Link href="/lab" className="text-teal-300 hover:underline">
            play with the live demos
          </Link>
          .
        </p>

        <nav aria-label="More posts" className="mt-10 grid sm:grid-cols-2 gap-4">
          {older ? (
            <Link
              href={`/blog/${older.slug}`}
              className="group rounded-xl border border-white/5 bg-slate-900/40 p-5 hover:border-teal-500/30 transition-colors"
            >
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <ArrowLeft size={12} /> Previous
              </span>
              <span className="block mt-2 font-display font-bold text-slate-200 group-hover:text-teal-300 transition-colors">
                {older.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link
              href={`/blog/${newer.slug}`}
              className="group rounded-xl border border-white/5 bg-slate-900/40 p-5 hover:border-teal-500/30 transition-colors sm:text-right"
            >
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1 sm:justify-end">
                Next <ArrowRight size={12} />
              </span>
              <span className="block mt-2 font-display font-bold text-slate-200 group-hover:text-teal-300 transition-colors">
                {newer.title}
              </span>
            </Link>
          )}
        </nav>
      </footer>
    </main>
  );
}

export function DemoCTA({
  href,
  title,
  desc,
  label,
}: {
  href: string;
  title: string;
  desc: string;
  label: string;
}) {
  return (
    <div className="mt-16 rounded-xl border border-teal-500/20 bg-teal-500/[0.06] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <div className="font-display font-bold text-slate-100 text-lg">{title}</div>
        <div className="text-slate-400 text-sm mt-1">{desc}</div>
      </div>
      <Link
        href={href}
        className="shrink-0 px-6 py-3 bg-teal-500 text-slate-950 font-bold rounded-lg hover:bg-teal-400 transition-colors font-mono flex items-center gap-2 text-sm"
      >
        {label} <ArrowRight size={16} />
      </Link>
    </div>
  );
}
