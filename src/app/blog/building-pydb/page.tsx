import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, Lead, Code, DemoCTA } from "@/components/BlogUI";

export const metadata: Metadata = {
  title: "Building a B-Tree Storage Engine From Scratch",
  description:
    "Why I built a database instead of using one: pages, a pager, a B-Tree, node splits, and a Write-Ahead Log, explained from first principles.",
  openGraph: {
    type: "article",
    title: "Building a B-Tree Storage Engine From Scratch",
    description:
      "Pages, a pager, a B-Tree, node splits, and a Write-Ahead Log: a database built from first principles.",
  },
};

export default function BuildingPyDB() {
  return (
    <ArticleLayout slug="building-pydb">
      <Lead>
        <p>
          I use databases every day. Postgres, Redis, Mongo, whatever the job needs. But &ldquo;I can
          use a database&rdquo; and &ldquo;I know how a database works&rdquo; are different claims, and
          I could only honestly make the first one. So I built a small storage engine to earn the
          second. I called it <strong className="text-slate-100">PyDB</strong>.
        </p>
        <p>
          Four ideas do most of the work: <span className="text-teal-300">pages</span>, a{" "}
          <span className="text-teal-300">pager</span>, a <span className="text-teal-300">B-Tree</span>,
          and a <span className="text-teal-300">Write-Ahead Log</span>. Once those clicked, the rest
          was detail. Later I built a smaller TypeScript version of it that runs live on this site.
        </p>
      </Lead>

      <Section title="Why build a database?">
        <p>
          A database hides three genuinely hard problems behind a friendly API: storing more data than
          fits in memory, finding a row without scanning everything, and not losing your data when the
          process dies mid-write. You can read about those problems, but you only really understand
          them once you&apos;ve been forced to solve them. Building removes the hand-waving.
        </p>
      </Section>

      <Section title="Everything is a page">
        <p>
          A database doesn&apos;t read your file one byte at a time. It reads fixed-size blocks called
          pages. Real engines use 4 to 8 KB, and so does PyDB; the version in the visualizer uses
          256-byte pages so you can actually read them. Every tree node and every row lives inside a
          page, which has a short header and then a run of cells:
        </p>
        <Code>{`leaf page:
  [ roleTag:1 | keyCount:2 | rightSibling:4 | pad:1 ]  header
  [ key:4 | userLen:1 | user… | emailLen:1 | email… ]  cell 0
  [ key:4 | userLen:1 | user… | emailLen:1 | email… ]  cell 1
  … zero padding …`}</Code>
        <p>
          Fixed sizes are what make the rest possible. Page number times page size gives you an exact
          byte offset, so random access turns into arithmetic instead of a search.
        </p>
      </Section>

      <Section title="The pager: bytes on disk">
        <p>
          The pager owns those raw bytes. It hands out new pages, writes a node into a page, and reads
          a page back. It sits on the boundary between typed objects the tree understands and a flat
          array of bytes. Writing a key is just its four bytes, little-endian:
        </p>
        <Code>{`writeU32(page, offset, key);          // 4 bytes, little-endian
page[p++] = user.length;             // length-prefixed string
for (const b of encode(user)) page[p++] = b;`}</Code>
        <p>
          This is the part most &ldquo;learn databases&rdquo; tutorials skip. But decoding those four
          bytes back into the exact key you wrote is the whole point, and it&apos;s literally what the
          byte grid in the live demo renders.
        </p>
      </Section>

      <Section title="The B-Tree: sorted and shallow">
        <p>
          To find a row fast you need order. A B-Tree (I built a B+Tree, where the values live in the
          leaves) keeps keys sorted and keeps the tree short, so every leaf sits at the same depth. A
          lookup is a handful of comparisons no matter how much data you store, because the tree grows
          wide before it grows tall. Internal nodes hold only separator keys. The leaves hold the data
          and link left to right, which makes range scans easy.
        </p>
      </Section>

      <Section title="Splits: how the tree grows">
        <p>
          Push enough keys into a leaf and it overflows. When it does, the leaf splits. Half the keys
          move to a new page, and the first key of the new page gets copied up to the parent as a
          separator. If the parent overflows too, it splits and pushes a key up. If that reaches the
          root, the tree gains a level. That single mechanism is what keeps everything balanced:
        </p>
        <Code>{`if (leaf.keys.length > LEAF_CAP) {
  const right = pager.allocate("leaf");
  right.keys = leaf.keys.splice(mid);          // move the upper half
  return { promoteKey: right.keys[0], right };  // copy up
}`}</Code>
        <p>
          In the demo, hit Insert a few times and watch a leaf fill, split, and eventually trigger a
          root split that bumps the height. None of that is animation. It&apos;s the real algorithm
          reacting to real state.
        </p>
      </Section>

      <Section title="The Write-Ahead Log: surviving a crash">
        <p>
          Here&apos;s the question that separates a toy from a database. What happens if the process
          dies halfway through a write? The answer is the Write-Ahead Log. Before touching a page you
          append a record saying what you&apos;re about to do. Only then do you change the page. On
          restart you replay the log. Because the log is written first, you can always recover to a
          consistent state, and commit records tell you which transactions actually finished:
        </p>
        <Code>{`wal.append({ op: "INSERT", pageId, key });   // 1. log the intent
pager.writeLeaf(pageId, keys, values);       // 2. then apply it
wal.append({ op: "COMMIT", txId });          // 3. mark it done`}</Code>
        <p>
          That ordering is necessary, but it isn&apos;t enough on its own. My first version followed
          it exactly and still lost every committed write when I killed the process, because it
          replayed the wrong transactions onto a data file that was never made durable. What you
          replay, and what you replay it onto, matter as much as the order you write in. I wrote that
          one up separately:{" "}
          <Link href="/blog/pydb-crash-test" className="text-teal-300 hover:underline">
            my database lost every committed write, and one test found it
          </Link>
          .
        </p>
      </Section>

      <Section title="From Python to the browser">
        <p>
          PyDB started in Python. To make it interactive here, I built a TypeScript version on the
          same ideas, scaled down so you can watch it: 256-byte pages instead of 8 KB, a fanout of four,
          and deletes and internal-node splits that the Python engine doesn&apos;t have. It keeps a
          write-ahead log too, but it lives in memory, so there&apos;s nothing to recover from; the
          crash-recovery tests live in the Python repo. The nice side effect: the exact module the unit
          tests drive is the module the page renders. When a test asserts &ldquo;all leaves stay at
          equal depth after 500 random inserts,&rdquo; it&apos;s checking the code you&apos;re clicking
          on.
        </p>
      </Section>

      <Section title="What I&apos;d tell my past self">
        <p>
          Build the smallest real version first. A B-Tree that only does insert, search, and splits,
          but does them correctly, teaches you more than a half-built engine with every feature stubbed
          out. Write the invariant tests early: sorted order, equal leaf depth, log-before-apply. Then
          write the one that kills the process, because that&apos;s the one that tells you whether the
          word &ldquo;durable&rdquo; is true. And serialize to real bytes, not to a convenient object.
          The bytes are where the understanding actually lives.
        </p>
      </Section>

      <DemoCTA
        href="/lab#storage"
        title="See it running"
        desc="The TypeScript version runs live in the Lab. Insert keys, watch splits, read the WAL."
        label="Open the demo"
      />
    </ArticleLayout>
  );
}
