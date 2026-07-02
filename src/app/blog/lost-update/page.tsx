import type { Metadata } from "next";
import { ArticleLayout, Section, Lead, Code } from "@/components/BlogUI";

export const metadata: Metadata = {
  title: "Two requests, one row, and a lost update",
  description:
    "Two people saved the same record a second apart and one edit silently vanished. A story about the lost-update race, optimistic concurrency, and when to actually reach for a distributed lock.",
  openGraph: {
    type: "article",
    title: "Two requests, one row, and a lost update",
    description:
      "The lost-update race, optimistic concurrency, and when a distributed Redis lock is worth the risk.",
  },
};

export default function LostUpdate() {
  return (
    <ArticleLayout
      tag="Concurrency · Systems"
      date="March 2026"
      read="7 min read"
      title="Two requests, one row, and a lost update"
    >
      <Lead>
        <p>
          Two clinicians opened the same patient record, both edited the medication list, and both hit
          save within about a second of each other. One of the two edits silently vanished. No error,
          no warning, nothing in the logs. The database did exactly what we told it to. The problem was
          that we&apos;d told it something dumb.
        </p>
      </Lead>

      <Section title="The lost update">
        <p>
          The shape of this bug is everywhere once you know to look for it. You read a row, change it in
          application code, and write it back. Request A reads version 5. Request B reads version 5.
          Request A writes its change. Request B writes over it. Last write wins, and &ldquo;wins&rdquo;
          is carrying a lot of weight in that sentence, because A&apos;s edit is just gone.
        </p>
        <p>
          Under light traffic you will never see this. The window between read and write is a few
          milliseconds, and two people rarely hit it at once. Under load, that window is a coin flip you
          keep losing, and the symptom is the worst kind: not a crash, just data that&apos;s quietly
          wrong.
        </p>
      </Section>

      <Section title="Optimistic concurrency: assume you&apos;re fine, then check">
        <p>
          The cheapest fix that actually holds is optimistic concurrency. Add a version column. Read it
          along with the row. When you write, only write if the version is still what you read, and bump
          it in the same statement:
        </p>
        <Code>{`UPDATE records
SET data = $1, version = version + 1
WHERE id = $2 AND version = $3;

-- 0 rows affected → someone changed it under you → re-read and retry, or reject`}</Code>
        <p>
          If the update touches zero rows, somebody beat you to it, and now you get to decide what that
          means: re-read and reapply, or tell the user their view was stale. Either way, nothing gets
          silently clobbered. No locks, no held connections, and it scales, because in the common case
          there&apos;s no conflict and you pay almost nothing.
        </p>
      </Section>

      <Section title="When optimistic isn&apos;t enough">
        <p>
          Sometimes one atomic UPDATE can&apos;t express what you need. The operation spans multiple
          systems, or several writes that have to happen together, and you genuinely need mutual
          exclusion across services. That&apos;s when a distributed lock earns its place. In Redis
          it&apos;s a key you set only if it doesn&apos;t exist, with an expiry so a dead holder
          can&apos;t block everyone forever:
        </p>
        <Code>{`SET lock:invoice:4123 <token> NX PX 5000   // acquire, auto-expire after 5s
// ... do the protected work ...
// release ONLY if we still hold it (compare token), never a blind DEL`}</Code>
      </Section>

      <Section title="A lock is a loaded gun">
        <p>
          Here&apos;s the part people skip when they excitedly add a lock. A distributed lock is itself a
          distributed systems problem. What if the holder crashes? The expiry saves you, but now your
          work can outlive the lock, and a second worker can start while the first is still going. What
          if the work takes longer than the expiry? Same thing, two holders. And if you release with a
          blind <code>DEL</code>, you might delete a lock that someone else already acquired. That is the
          whole Redlock argument in miniature, and the practical takeaway is simple: reach for optimistic
          concurrency first, use a lock only when you truly can&apos;t model the operation as one atomic
          write, and keep the critical section short.
        </p>
      </Section>

      <Section title="What we shipped">
        <p>
          Most of our races were single-row and disappeared the moment we added a version column. A
          smaller set genuinely needed a lock, the cross-service operations that touched more than one
          system at once. The real work was telling those two cases apart, not the code for either. The
          races went away, and more importantly, they stopped going away <em>silently</em>.
        </p>
        <p className="text-slate-400">
          A lost update has no stack trace and no error. Just data that&apos;s wrong. Make your writes
          assert what they expected to be true, and let them fail loudly when it isn&apos;t.
        </p>
      </Section>
    </ArticleLayout>
  );
}
