"use client";

import Image from "next/image";
import Link from "next/link";
import { also, featured, others } from "@/lib/work";
import { track } from "@/lib/track";

export default function Work() {
  const image = featured.image;
  const opened = (title: string) => () => track("case_study_open", { title });

  return (
    <section id="work" className="max-w-4xl mx-auto w-full px-5 md:px-8 scroll-mt-28">
      <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-50 tracking-tight mb-8">Work</h2>

      <Link href={`/work/${featured.slug}`} onClick={opened(featured.title)} className="group block">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="rounded-xl border border-white/[0.07]"
            sizes="(min-width: 896px) 52rem, 100vw"
          />
        )}
        <h3 className="font-display font-bold text-2xl text-slate-50 tracking-tight mt-5 group-hover:text-teal-400 transition-colors">
          {featured.title}
        </h3>
        <p className="text-slate-300 leading-relaxed mt-1">{featured.short}</p>
        <p className="text-sm text-slate-500 mt-2">{featured.context}</p>
      </Link>

      <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07] mt-10">
        {others.map((w) => (
          <li key={w.slug}>
            <Link href={`/work/${w.slug}`} onClick={opened(w.title)} className="group block py-5">
              <h3 className="font-display font-bold text-lg text-slate-100 group-hover:text-teal-400 transition-colors">{w.title}</h3>
              <p className="text-slate-400 leading-relaxed mt-1">{w.short}</p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-slate-400 mt-6">
        Also:{" "}
        {also.map((w) => (
          <span key={w.slug}>
            <Link href={`/work/${w.slug}`} className="text-teal-400 hover:text-teal-300">{w.title}</Link>
            {", "}
          </span>
        ))}
        and <Link href="/lab" className="text-teal-400 hover:text-teal-300">live demos in the Lab</Link>.
      </p>
    </section>
  );
}
