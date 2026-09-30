import type { Metadata } from "next";
import { ArticleLayout, Section, Lead, Code, C, DemoCTA } from "@/components/BlogUI";

export const metadata: Metadata = {
  title: "Add one server, move 90% of your keys",
  description:
    "hash(key) % N is the obvious way to spread data across servers, and it falls apart the moment N changes. Measured numbers from a consistent-hash ring, virtual nodes, and why the choice of hash function matters more than you'd expect.",
  openGraph: {
    type: "article",
    title: "Add one server, move 90% of your keys",
    description: "Modulo sharding vs a consistent-hash ring, with measured numbers.",
  },
};

export default function ConsistentHashing() {
  return (
    <ArticleLayout slug="consistent-hashing">
      <Lead>
        <p>
          Say you have ten cache servers and you pick one for each key with <C>hash(key) % 10</C>. It
          spreads load evenly and it&apos;s one line of code. Then traffic grows and you add an eleventh
          server. Now it&apos;s <C>% 11</C>, and almost every key maps to a different server than it did a
          second ago. Every one of those lookups misses, and all of that traffic falls through to the
          database at the same moment.
        </p>
        <p>
          I built a consistent-hash ring for the Lab on this site so I could measure that instead of
          quoting it. All the numbers below come from that code, over 10,000 keys, averaged across five
          random key sets.
        </p>
      </Lead>

      <Section title="How bad modulo actually is">
        <p>
          With <C>% N</C>, a key stays put only if its hash gives the same remainder for both N and N+1.
          For most keys it doesn&apos;t. Going from N to N+1 servers moves about N/(N+1) of everything,
          and it gets worse as the cluster grows:
        </p>
        <Code>{`servers    modulo moved    ring moved    ideal
3 → 4          74.8%          26.7%        25%
4 → 5          80.1%          19.6%        20%
9 → 10         89.9%          10.4%        10%`}</Code>
        <p>
          The ideal is 1/(N+1): the new server should end up with its fair share, and only that share
          should move. The ring gets within a point or two of it. Modulo moves nine keys out of ten to
          add one server to ten.
        </p>
      </Section>

      <Section title="The ring">
        <p>
          Consistent hashing puts servers and keys on the same circle. Hash every server to a point on a
          2<sup>32</sup> ring. Hash a key to a point, then walk clockwise until you hit a server; that
          server owns the key. In code, the ring is a sorted array and the walk is a binary search:
        </p>
        <Code>{`getNode(key) {
  const h = hash(key);
  let lo = 0, hi = ring.length;
  while (lo < hi) {                    // first point with hash >= h
    const mid = (lo + hi) >> 1;
    if (ring[mid].hash < h) lo = mid + 1; else hi = mid;
  }
  return ring[lo % ring.length].nodeId; // wrap around past the top
}`}</Code>
        <p>
          Add a server and it lands somewhere on the circle, taking over only the arc just behind it.
          Keys everywhere else don&apos;t notice. The tests check this directly: after adding a server,
          every key that moved must have moved <em>to the new server</em>, never between two old ones.
          Removing a server is the mirror image: only its keys move, to its neighbours.
        </p>
      </Section>

      <Section title="One point per server isn&apos;t enough">
        <p>
          With a single point each, five servers carve the circle into five arcs of random length. In my
          run, one server owned 1.7% of the keys and another owned 35.7%. The fix is virtual nodes: hash
          each server many times (<C>node-0#0</C>, <C>node-0#1</C>, and so on) so it owns lots of small
          arcs instead of one big one, and the random lengths average out.
        </p>
        <Code>{`vnodes per server    smallest share    largest share    (ideal 20%)
1                    1.7%              35.7%
10                   13.3%             26.5%
50                   18.8%             21.5%
100                  18.4%             21.1%
200                  16.9%             22.1%`}</Code>
        <p>
          Most of the benefit arrives by about 50. After that it stops improving in any way a single run
          can show, and the 200 row being slightly worse than 100 is noise from one key set, not a trend.
          More virtual nodes also means a bigger ring to search and more work on every membership change,
          so there&apos;s no prize for going higher than you need.
        </p>
      </Section>

      <Section title="The hash function matters more than you&apos;d expect">
        <p>
          The code has two hash functions: FNV-1a, which is small, fast and what the modulo mode uses, and
          MurmurHash3. Build the ring with FNV-1a instead and, with 50 virtual nodes across five servers,
          the shares come out anywhere from 11.8% to 35.3%. That&apos;s not much better than having no
          virtual nodes at all.
        </p>
        <p>
          The reason is the virtual node names. <C>node-0#0</C>, <C>node-0#1</C>, <C>node-0#2</C> differ
          in one trailing character, and FNV-1a doesn&apos;t scramble a change at the end of the input
          very thoroughly, so a server&apos;s points end up bunched together instead of scattered.
          MurmurHash3 mixes every input bit into every output bit much more aggressively, and the same
          setup comes out at 18.5% to 21.6%. Same ring, same keys, different hash, which is why the ring
          uses Murmur.
        </p>
      </Section>

      <Section title="When you don&apos;t need any of this">
        <p>
          If the number of servers never changes, or you can afford to rebuild everything when it does,{" "}
          <C>% N</C> is simpler and perfectly even. The ring earns its keep when membership changes while
          traffic is flowing: caches scaling up and down, nodes failing, a database adding shards. There
          are other answers to the same problem too, like rendezvous hashing, which skips the ring and
          scores every server for every key. The ring just happens to be the one that&apos;s easiest to
          draw.
        </p>
      </Section>

      <DemoCTA
        href="/lab#sharding"
        title="Try it yourself"
        desc="Add and remove servers, switch to modulo, drag the virtual-node slider, and watch the numbers move."
        label="Open the demo"
      />
    </ArticleLayout>
  );
}
