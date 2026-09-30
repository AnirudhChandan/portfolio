import type { Metadata } from "next";
import { ArticleLayout, Section, Lead, Code, C } from "@/components/BlogUI";

export const metadata: Metadata = {
  title: "Alerting on something that didn't happen",
  description:
    "An AI camera can tell you someone climbed a fence. It can't tell you the guard never walked past. Building timers over the absence of events: late events, restarts, and one alert per lapse.",
  openGraph: {
    type: "article",
    title: "Alerting on something that didn't happen",
    description: "Timers over missing events: late arrivals, restarts, and one alert per lapse.",
  },
};

export default function AbsenceTimers() {
  return (
    <ArticleLayout slug="absence-timers">
      <Lead>
        <p>
          I built the alert dashboard for a residential site&apos;s guard room. The site already had an
          AI box watching the cameras, and it was good at events: an intrusion, a fall, a car parked on
          the driveway. It sends an HTTP request when one happens and the dashboard shows it.
        </p>
        <p>
          Two of the client&apos;s requirements weren&apos;t events. &ldquo;Patrol not done&rdquo; and
          &ldquo;guard absent from post&rdquo; are about something <em>not</em> happening. No detector
          anywhere fires when a guard fails to walk past a checkpoint. The box only ever says
          &ldquo;someone was seen here&rdquo;. So the rule had to be a timer over the silence between
          those messages, and it had to live in my code.
        </p>
      </Lead>

      <Section title="The shape of it">
        <p>
          Each checkpoint is a row: which camera or input it listens to, which rule it enforces, a
          threshold in minutes, and when a guard was last seen there. Guards check in at four patrol
          points by triggering an input on the box, and each check-in resets that point&apos;s clock.
          The guard room has its own, much shorter threshold.
        </p>
        <p>
          Once a minute the server asks one question of every checkpoint: has it been quiet for longer
          than its threshold? If so, raise &ldquo;Patrol Not Done&rdquo;. That&apos;s the whole idea.
          Everything interesting is in the edge cases.
        </p>
      </Section>

      <Section title="A late message must not turn back the clock">
        <p>
          Events don&apos;t always arrive in order. A retry, a slow network hop, a box that buffered
          while the link was down. If a check-in from 10:05 arrives after one from 10:20, a naive{" "}
          <C>last_seen_at = ?</C> moves the clock backwards and can raise an alert for a patrol that
          actually happened. So the update keeps whichever time is later:
        </p>
        <Code>{`UPDATE checkpoints
SET last_seen_at = MAX(last_seen_at, ?)
WHERE camera_id = ?;`}</Code>
        <p>
          The timestamp is the event&apos;s own time when the box sends one, not the time my server
          received it. The question is when the guard was there, not when I heard about it.
        </p>
      </Section>

      <Section title="One lapse, one alert">
        <p>
          The minute tick keeps running while the checkpoint stays quiet. At 61 minutes the rule is
          broken; at 62, 90 and 200 it&apos;s still broken, and a guard room screen that adds a new
          alert every minute is a screen people learn to ignore. So before raising anything, the check
          looks for an alert that&apos;s already open for this checkpoint and rule:
        </p>
        <Code>{`for cp in checkpoints:
    if cp.muted_until and cp.muted_until > now:  continue
    if now - cp.last_seen_at <= cp.threshold:     continue
    if open_alert(cp.camera_id, cp.rule):         continue   # already standing
    raise_alert(cp, reason=f"no activity for {minutes} min")`}</Code>
        <p>
          When a guard finally shows up, the check-in resolves the open alert and resets the clock. The
          next time the checkpoint goes quiet is a new lapse, and it gets a new alert. That distinction
          matters later, because the patrol report counts lapses.
        </p>
      </Section>

      <Section title="The server will restart">
        <p>
          It runs on a PC in a guard room. Someone will turn it off. If the clocks lived in memory, a
          restart would reset every checkpoint to &ldquo;just seen&rdquo; and hide a missed patrol, or
          forget which alerts were already open and raise them all again.
        </p>
        <p>
          So none of it lives in memory. Last-seen times, open alerts and mutes are all rows in SQLite.
          On startup the site configuration is written with an upsert that updates the name and
          threshold but never touches <C>last_seen_at</C>. The first tick after a restart sees exactly
          the state the last tick before it saw.
        </p>
      </Section>

      <Section title="Testing an hour without waiting an hour">
        <p>
          The check takes <C>now</C> as a parameter instead of reading the clock. That one decision makes
          the whole thing testable in milliseconds:
        </p>
        <Code>{`addCheckpoint({ camera_id: "East Corner", threshold_min: 60, last_seen_at: T0 })

assert(checkTimers(T0 + 59 * MIN).length === 0)   // not yet
assert(checkTimers(T0 + 61 * MIN).length === 1)   // fires once
checkTimers(T0 + 90 * MIN); checkTimers(T0 + 200 * MIN)
assert(total("East Corner") === 1)                // no pile-up
touchCheckpoint("East Corner", T0 + 210 * MIN)
assert(openCount("East Corner") === 0)            // a visit clears it
assert(checkTimers(T0 + 275 * MIN).length === 1)  // a new lapse fires again`}</Code>
        <p>
          A bug here means a missed patrol goes unreported, which is the one thing the system exists to
          catch. It was the first part of the codebase to get a test file.
        </p>
      </Section>

      <Section title="When the silence is the sensor">
        <p>
          There&apos;s one more kind of quiet. If the AI box itself stops sending, every checkpoint goes
          silent at once, and the dashboard would blame every guard for a network cable. So the server
          separately tracks when it last heard anything at all from the box. After a configurable
          silence it shows a banner on every screen saying the box has gone quiet, so &ldquo;nobody
          patrolled&rdquo; and &ldquo;we can&apos;t tell&rdquo; don&apos;t look the same.
        </p>
        <p>
          None of this is complicated code. The whole timer module is under a hundred lines. The work
          was in noticing that &ldquo;alert when X doesn&apos;t happen&rdquo; hides four separate
          questions: what time is it really, have I already said this, what survives a restart, and am
          I sure the silence means what I think it means.
        </p>
      </Section>
    </ArticleLayout>
  );
}
