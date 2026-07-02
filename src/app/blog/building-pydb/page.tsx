import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Building a B-Tree Storage Engine From Scratch",
  description:
    "Why I built a database instead of using one — pages, a pager, a B-Tree, node splits, and a Write-Ahead Log, explained from first principles.",
  openGraph: {
    type: "article",
    title: "Building a B-Tree Storage Engine From Scratch",
    description:
      "Pages, a pager, a B-Tree, node splits, and a Write-Ahead Log — a database built from first principles.",
  },
};

function Code({ children }: { children: string }) {
  return (
    <pre className="my-6 overflow-x-auto rounded-xl border border-white/5 bg-[#020408] p-4 text-[13px] leading-relaxed font-mono text-slate-300">
      <code>{children}</code>
    </pre>
  );
}

export default function BuildingPyDB() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-32">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-400 transition-colors font-mono text-sm mb-12"
      >
        <ArrowLeft size={16} /> Writing
      </Link>

      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-5">
        <span className="text-teal-400">Systems · Databases</span>
        <span>July 2026</span>
        <span className="flex items-center gap-1">
          <Clock size={12} /> 9 min read
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl font-display font-black text-slate-100 tracking-tighter leading-tight mb-8">
        Building a B-Tree Storage Engine From Scratch
      </h1>

      <div className="text-slate-300 text-lg leading-relaxed space-y-6">
        <p>
          I use databases every day. Postgres, Redis, MongoDB — I&apos;ve shipped systems on all of
          them. But &ldquo;I can use a database&rdquo; and &ldquo;I understand how a database
          works&rdquo; are very different claims. So I set out to earn the second one the only way I
          trust: by building a small but real storage engine from scratch. I called it{" "}
          <strong className="text-slate-100">PyDB</strong>.
        </p>
        <p>
          This is the story of the four ideas that make it work —{" "}
          <span className="text-teal-300">pages</span>, a <span className="text-teal-300">pager</span>,
          a <span className="text-teal-300">B-Tree</span>, and a{" "}
          <span className="text-teal-300">Write-Ahead Log</span> — and how I later ported the whole
          thing to TypeScript so it runs live on this site.
        </p>
      </div>

      <Section title="1 · Why build a database?">
        <p>
          Databases feel like magic because they hide three genuinely hard problems behind a simple
          API: storing more data than fits in memory, finding a row fast, and never losing data even
          if the process is killed mid-write. You can&apos;t appreciate those problems by reading
          docs. You appreciate them by hitting them. Building forces every hand-wave into a decision.
        </p>
      </Section>

      <Section title="2 · Everything is a page">
        <p>
          The first realization: a database doesn&apos;t read your file byte-by-byte. It reads it in
          fixed-size blocks called <strong className="text-slate-100">pages</strong> (real engines
          use 4–8&nbsp;KB; I use a small page so the bytes stay legible in the visualizer). Every node
          of the tree, every row, lives inside a page. A page has a small header and then a run of
          cells:
        </p>
        <Code>{`leaf page:
  [ roleTag:1 | keyCount:2 | rightSibling:4 | pad:1 ]  ← 8-byte header
  [ key:4 | userLen:1 | user… | emailLen:1 | email… ]  ← cell 0
  [ key:4 | userLen:1 | user… | emailLen:1 | email… ]  ← cell 1
  … zero padding …`}</Code>
        <p>
          Fixed-size pages are the trick that makes everything else possible: page number × page size
          = exact byte offset on disk. Random access becomes arithmetic.
        </p>
      </Section>

      <Section title="3 · The pager: bytes on disk">
        <p>
          The <strong className="text-slate-100">pager</strong> owns those raw bytes. It allocates
          new pages, serializes a node into a page, and reads a page back. It&apos;s the boundary
          between &ldquo;typed objects the tree understands&rdquo; and &ldquo;a flat array of
          bytes.&rdquo; Serializing a key is just writing its four bytes little-endian:
        </p>
        <Code>{`writeU32(page, offset, key);          // 4 bytes, little-endian
page[p++] = user.length;             // length-prefixed string
for (const b of encode(user)) page[p++] = b;`}</Code>
        <p>
          This is the part people skip when they &ldquo;learn databases&rdquo; from a tutorial. But
          decoding those four bytes back into the exact key you wrote is what makes it real — and it&apos;s
          exactly what the byte grid in the live demo is showing you.
        </p>
      </Section>

      <Section title="4 · The B-Tree: sorted and shallow">
        <p>
          To find a row fast you need order. A B-Tree (I built a B+Tree, where all values live in the
          leaves) keeps keys sorted <em>and</em> keeps the tree short — every leaf sits at the same
          depth. A lookup is a handful of comparisons no matter how much data you store, because the
          tree grows wide before it grows tall. Internal nodes hold only separator keys; the leaves
          hold the data and are linked left-to-right so range scans are trivial.
        </p>
      </Section>

      <Section title="5 · Splits: how the tree grows">
        <p>
          Insert enough keys into a leaf and it overflows. When it does, the leaf{" "}
          <strong className="text-slate-100">splits</strong>: half the keys move to a freshly
          allocated page, and the first key of the new page is copied up to the parent as a separator.
          If the parent overflows too, it splits and pushes a key up — and if that reaches the root,
          the tree gains a whole new level. That&apos;s the entire growth mechanism, and it&apos;s
          what keeps every leaf balanced:
        </p>
        <Code>{`if (leaf.keys.length > LEAF_CAP) {
  const right = pager.allocate("leaf");
  right.keys = leaf.keys.splice(mid);   // move upper half
  return { promoteKey: right.keys[0], right };  // copy-up
}`}</Code>
        <p>
          In the live demo, click <em>Insert</em> a few times and watch a leaf hit capacity, split,
          and — eventually — trigger a root split that bumps the tree height. None of it is animation;
          it&apos;s the real algorithm reacting to real state.
        </p>
      </Section>

      <Section title="6 · The Write-Ahead Log: surviving a crash">
        <p>
          Here&apos;s the question that separates a toy from a database:{" "}
          <em>what if the process dies halfway through a write?</em> The answer is the{" "}
          <strong className="text-slate-100">Write-Ahead Log</strong>. Before touching a page, you
          append a record describing what you&apos;re about to do. Only then do you mutate the page.
          On restart, you replay the log. Because the log is written first — <em>log-before-apply</em>{" "}
          — you can always recover to a consistent state. Commit records mark which transactions
          actually finished:
        </p>
        <Code>{`wal.append({ op: "INSERT", pageId, key });  // 1. log intent
pager.writeLeaf(pageId, keys, values);      // 2. then apply
wal.append({ op: "COMMIT", txId });         // 3. mark done`}</Code>
        <p>
          That ordering is the &ldquo;A&rdquo; and &ldquo;D&rdquo; of ACID — atomicity and durability
          — falling out of one simple discipline. The WAL panel in the demo shows this log growing in
          real time, with strictly increasing sequence numbers.
        </p>
      </Section>

      <Section title="7 · From Python to your browser">
        <p>
          PyDB started in pure Python. To make it interactive on this site, I re-implemented the same
          architecture in TypeScript — same pager, same B+Tree, same WAL — so it runs entirely
          client-side with zero backend. The win: the exact module the unit tests drive is the module
          the UI renders. When a test asserts &ldquo;all leaves stay at equal depth after 500 random
          inserts,&rdquo; it&apos;s validating the very code you&apos;re clicking on.
        </p>
      </Section>

      <Section title="8 · What I&apos;d tell my past self">
        <p>
          Build the smallest real version first. A B-Tree with insert, search, and splits — fully
          correct — teaches you more than a half-finished engine with every feature stubbed. Write the
          invariant tests early (sorted order, equal leaf depth, log-before-apply); they turn
          &ldquo;I think this works&rdquo; into &ldquo;this provably works.&rdquo; And serialize to
          real bytes, not to a convenient object — the bytes are where the understanding actually
          lives.
        </p>
      </Section>

      <div className="mt-16 rounded-xl border border-teal-500/20 bg-teal-500/[0.06] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-display font-bold text-slate-100 text-lg">See it running</div>
          <div className="text-slate-400 text-sm mt-1">
            The TypeScript port runs live on the home page — insert keys, watch splits, read the WAL.
          </div>
        </div>
        <Link
          href="/#storage"
          className="shrink-0 px-6 py-3 bg-teal-500 text-slate-950 font-bold rounded-lg hover:bg-teal-400 transition-colors font-mono flex items-center gap-2 text-sm"
        >
          Open the demo <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-100 tracking-tight mb-5">
        {title}
      </h2>
      <div className="text-slate-300 text-lg leading-relaxed space-y-5">{children}</div>
    </section>
  );
}
