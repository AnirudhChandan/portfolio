import type { Metadata } from "next";
import { ArticleLayout, Section, Lead, Code } from "@/components/BlogUI";

export const metadata: Metadata = {
  title: "53 endpoints, one lazy loop, 15.6 seconds",
  description:
    "One page took 15.6 seconds to load. It wasn't a slow query. It was 101 fast ones. A short story about the N+1 problem and counting your round trips.",
  openGraph: {
    type: "article",
    title: "53 endpoints, one lazy loop, 15.6 seconds",
    description: "It wasn't a slow query. It was 101 fast ones. A short story about the N+1 problem.",
  },
};

export default function NPlusOne() {
  return (
    <ArticleLayout
      tag="Performance · Databases"
      date="April 2026"
      read="6 min read"
      title="53 endpoints, one lazy loop, 15.6 seconds"
    >
      <Lead>
        <p>
          A page took 15.6 seconds to load. Not the first load, not a cold cache. Every single time.
          Someone opened a ticket that just said &ldquo;the list page is broken,&rdquo; which is how
          users report &ldquo;slow.&rdquo;
        </p>
      </Lead>

      <Section title="The wrong first guess">
        <p>
          I did the obvious thing and blamed a query. Opened the slow query log expecting one monster
          SELECT with a missing index. It wasn&apos;t there. Every query was fast, single-digit
          milliseconds, all of them. That&apos;s the tell, and it took me longer than I&apos;d like to
          admit to actually see it: the problem wasn&apos;t a slow query. It was a hundred fast ones.
        </p>
        <p>
          101 queries for one page load. One to fetch the list, then one more per row to load its
          relations, in a loop. The classic N+1. And the ORM made it invisible, because{" "}
          <code>item.owner.name</code> looks like reading a property. It isn&apos;t. It&apos;s a round
          trip to the database, and I&apos;d hidden a hundred of them inside a single{" "}
          <code>.map()</code>.
        </p>
        <Code>{`const items = await repo.findAll();                 // 1 query
for (const item of items) {
  item.owner = await ownerRepo.find(item.ownerId);  // +1 query each
}                                                   // 100 rows → 101 queries`}</Code>
      </Section>

      <Section title="The unsatisfying fix">
        <p>
          The fix isn&apos;t clever, which is the annoying part. Fetch the relations in one shot. A join,
          an <code>IN (...)</code>, or the ORM&apos;s eager-load. One query instead of a hundred.
        </p>
        <Code>{`const items = await repo.findAll({ include: ["owner"] }); // 1 query, joined`}</Code>
        <p>
          15.6s down to 2.4s on that endpoint. I&apos;ll be honest, 2.4s still isn&apos;t fast, so Redis
          caching came next for the hot ones. But the bulk of the win was simply not talking to the
          database a hundred times to render one page.
        </p>
        <p>
          Then I went looking, and found the same shape across 53 endpoints. Same lazy loop, different
          nouns. Same fix every time.
        </p>
      </Section>

      <Section title="The habit that would&apos;ve caught all of it">
        <p>
          Count your queries per request and put the number in your logs. That&apos;s it. An endpoint
          that fires 100 queries will never be fast no matter how good each one is, and you can&apos;t
          fix a number you never look at. Once that count was in front of us, the bad endpoints
          basically raised their own hands.
        </p>
        <p className="text-slate-400">
          The database is rarely slow. The number of times you talk to it usually is.
        </p>
      </Section>
    </ArticleLayout>
  );
}
