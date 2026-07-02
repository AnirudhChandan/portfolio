import type { Metadata } from "next";
import { ArticleLayout, Section, Lead, Code } from "@/components/BlogUI";

export const metadata: Metadata = {
  title: "Exactly-once is mostly a marketing slide",
  description:
    "A deploy blipped and some tax records got processed twice. Here's how I stopped chasing 'exactly-once' and built consumers that don't care about duplicates.",
  openGraph: {
    type: "article",
    title: "Exactly-once is mostly a marketing slide",
    description: "Why I stopped chasing exactly-once Kafka delivery and built idempotent consumers instead.",
  },
};

export default function ExactlyOnceKafka() {
  return (
    <ArticleLayout
      tag="Distributed Systems · Kafka"
      date="May 2026"
      read="8 min read"
      title="Exactly-once is mostly a marketing slide"
    >
      <Lead>
        <p>
          A deploy went out on a Thursday. Rolling restart, nothing dramatic. A few minutes later a
          report didn&apos;t reconcile: a handful of tax line items had been computed twice. When the
          domain is money, &ldquo;processed twice&rdquo; is not a rounding error. It&apos;s a bug with a
          lawyer attached.
        </p>
      </Lead>

      <Section title="The thing nobody wants to hear">
        <p>
          Kafka delivers at-least-once by default. There is an exactly-once story (the idempotent
          producer, transactions) and it&apos;s real, but it&apos;s exactly-once <em>within Kafka</em>.
          The second your consumer writes to a database, or calls another service, or sends an email,
          you&apos;ve stepped outside that transaction and you&apos;re back to designing for duplicates.
        </p>
        <p>
          Our pipeline read messages and wrote computed results to a database. That write is exactly the
          boundary where the exactly-once guarantee quietly stops applying. So during that rolling
          restart, a consumer picked up messages it had already processed but hadn&apos;t committed the
          offset for yet, and did the work again. At-least-once, working as designed. Doing exactly what
          it says on the tin, just not what I wanted.
        </p>
      </Section>

      <Section title="Stop chasing it. Absorb it instead.">
        <p>
          The move that actually holds up is to make the consumer idempotent. Processing the same message
          twice should land you in the same place as processing it once. Get that, and at-least-once
          delivery stops being scary, because a duplicate is just a no-op you paid a little CPU for.
        </p>
        <p>
          Every message carried a stable id. (If yours don&apos;t, derive one from the fields that make
          it unique.) Before doing the work, I try to record that id in a <code>processed</code> table
          with a unique constraint. If the insert conflicts, I&apos;ve already handled this message, so I
          skip it. Crucially, the dedup row and the actual write go in the same database transaction, so
          they commit or roll back together.
        </p>
        <Code>{`-- same transaction as the result write
INSERT INTO processed (message_id) VALUES ($1)
ON CONFLICT (message_id) DO NOTHING;

-- 0 rows affected → we've seen this one before → skip the work`}</Code>
      </Section>

      <Section title="The offset trap">
        <p>
          The other half is <em>when</em> you commit offsets, and it&apos;s easy to get backwards. Commit
          after your write is durable, never before. If you commit the offset first and then crash, the
          message is gone for good. That&apos;s at-most-once, which is worse than the problem you started
          with. Process, make it durable, then commit. Crash anywhere in that window and you simply
          reprocess, which the idempotency now shrugs off.
        </p>
      </Section>

      <Section title="Keys, partitions, and order">
        <p>
          One more thing that trips people up: ordering only holds inside a partition, and a message only
          lands on the same partition if you key it consistently. I keyed by the entity id so every event
          for one record stayed in order on one partition. Get this wrong and your &ldquo;duplicate&rdquo;
          might actually be two related events racing on different partitions, which is a different and
          nastier bug wearing the same costume.
        </p>
      </Section>

      <Section title="When a message just won&apos;t go">
        <p>
          Some messages are poison. Wrong shape, a bug downstream, a record that references something that
          no longer exists. Retry a few times with backoff, and if it still won&apos;t process, move it to
          a dead-letter queue and raise an alert. Do not let one bad message wedge the partition while
          everything behind it waits. I&apos;ve watched a single malformed record stall an entire pipeline
          because someone decided infinite retries were &ldquo;safer.&rdquo; They are not.
        </p>
      </Section>

      <Section title="Where it landed">
        <p>
          The result was exactly-once <em>effects</em> across partitions, even through the network blips
          that come free with every rolling deploy. Not because the transport promised it, but because I
          stopped trusting the transport to and pushed the guarantee down to a database constraint.
        </p>
        <p className="text-slate-400">
          Exactly-once delivery is hard and often oversold. Exactly-once effect is a unique index and a
          bit of discipline. Build the second one.
        </p>
      </Section>
    </ArticleLayout>
  );
}
