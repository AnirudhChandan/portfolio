import type { Metadata } from "next";
import { ArticleLayout, Section, Lead, Code } from "@/components/BlogUI";

export const metadata: Metadata = {
  title: "Your retry logic is a small DDoS you wrote yourself",
  description:
    "A downstream service hiccuped for thirty seconds. Our retries turned that into a four-minute outage. On backoff, jitter, knowing when to quit, and the dead-letter queue.",
  openGraph: {
    type: "article",
    title: "Your retry logic is a small DDoS you wrote yourself",
    description: "Backoff, jitter, when to quit, and the dead-letter queue that keeps 'zero data loss' honest.",
  },
};

export default function RetryStorms() {
  return (
    <ArticleLayout
      tag="Resilience · Systems"
      date="February 2026"
      read="6 min read"
      title="Your retry logic is a small DDoS you wrote yourself"
    >
      <Lead>
        <p>
          A downstream service had a bad thirty seconds. Nothing serious, a brief hiccup. Our system
          turned that hiccup into a four-minute outage entirely on its own. The retries did it.
        </p>
      </Lead>

      <Section title="The responsible-looking mistake">
        <p>
          The naive retry is the code everyone writes, and it feels like the careful thing to do. A
          request fails, so try it again. Maybe a few times. What actually happens under load is uglier.
          The downstream slows down for a moment, every client retries at once, the extra traffic makes
          it slower, and the slowness triggers more retries. You&apos;ve built a feedback loop that kicks
          a struggling service while it&apos;s down. A retry, at scale, is a small DDoS you wrote yourself
          and aimed at your own backend.
        </p>
      </Section>

      <Section title="Back off, and add jitter">
        <p>
          Two fixes, and you need both. Exponential backoff means you wait longer after each failure
          (100ms, then 200, then 400) so you stop hammering. Jitter means you add randomness to that
          wait, so a thousand clients that all failed at the same instant don&apos;t all retry at the
          same instant. Backoff without jitter just reshapes the stampede into tidy synchronized waves,
          which is barely better.
        </p>
        <Code>{`delay = base * (2 ** attempt)        # exponential backoff
delay = random.uniform(0, delay)     # full jitter
time.sleep(delay)`}</Code>
      </Section>

      <Section title="Know when to quit">
        <p>
          Retries are for <em>transient</em> failures. A network blip, a momentary timeout, a service
          catching its breath. They are not for a request that is simply wrong. If the payload is
          malformed or the record it references doesn&apos;t exist, retrying just fails slower and burns
          resources doing it. Cap the attempts. When you hit the cap, stop and hand the problem off.
        </p>
      </Section>

      <Section title="The dead-letter queue is the escape hatch">
        <p>
          So what happens to the message that fails its final retry? It can&apos;t just evaporate. We
          served 24 modules with a promise of zero data loss, and &ldquo;zero&rdquo; is a number you keep
          or you don&apos;t. The message goes to a dead-letter queue: parked, not lost. You alert on it,
          you look at it, you fix the cause, and you replay it. The DLQ is what lets you fail loudly and
          safely instead of silently dropping data or retrying into the void forever.
        </p>
      </Section>

      <Section title="The thing that makes retries safe at all">
        <p>
          None of this works unless the operation is idempotent, because a &ldquo;failed&rdquo; request
          might have actually succeeded before the response got lost on the way back. Retry that, and you
          could double-charge someone. (I went deep on this in the{" "}
          <a className="text-teal-400 hover:underline" href="/blog/exactly-once-kafka">
            Kafka post
          </a>
          .) If a retry can duplicate an effect, your retry logic isn&apos;t a safety net, it&apos;s a
          second bug waiting for the first one to fire.
        </p>
        <p className="text-slate-400">
          Retries are supposed to absorb failure, not amplify it. Backoff, jitter, a cap, and a DLQ are
          the whole difference between the two.
        </p>
      </Section>
    </ArticleLayout>
  );
}
