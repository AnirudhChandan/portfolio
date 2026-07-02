import type { Metadata } from "next";
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
    <ArticleLayout
      tag="Systems · Databases"
      date="July 2026"
      read="9 min read"
      title="Building a B-Tree Storage Engine From Scratch"
    >
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
          was detail. Later I rewrote the whole thing in TypeScript so it runs live on this site.
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
          pages (real engines use 4 to 8 KB; I used something smaller so the bytes stay readable in the
          visualizer). Every tree node and every row lives inside a page, which has a short header and
          then a run of cells:
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
          That ordering is the A and the D of ACID falling out of one rule: log before you apply. The
          WAL panel in the demo shows the log growing live, with strictly increasing sequence numbers.
        </p>
      </Section>

      <Section title="From Python to the browser">
        <p>
          PyDB started in Python. To make it interactive here, I reimplemented the same architecture in
          TypeScript. Same pager, same B+Tree, same WAL, running entirely client-side with no backend.
          The nice side effect: the exact module the unit tests drive is the module the page renders.
          When a test asserts &ldquo;all leaves stay at equal depth after 500 random inserts,&rdquo;
          it&apos;s checking the code you&apos;re clicking on.
        </p>
      </Section>

      <Section title="What I&apos;d tell my past self">
        <p>
          Build the smallest real version first. A B-Tree that only does insert, search, and splits,
          but does them correctly, teaches you more than a half-built engine with every feature stubbed
          out. Write the invariant tests early: sorted order, equal leaf depth, log-before-apply. They
          turn &ldquo;I think this works&rdquo; into &ldquo;this provably works.&rdquo; And serialize to
          real bytes, not to a convenient object. The bytes are where the understanding actually lives.
        </p>
      </Section>

      <DemoCTA
        href="/#storage"
        title="See it running"
        desc="The TypeScript port runs live on the home page. Insert keys, watch splits, read the WAL."
        label="Open the demo"
      />
    </ArticleLayout>
  );
}
