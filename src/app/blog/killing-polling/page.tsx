import type { Metadata } from "next";
import { ArticleLayout, Section, Lead, Code } from "@/components/BlogUI";

export const metadata: Metadata = {
  title: "We were polling our own database to death",
  description:
    "Every dashboard hit the API every three seconds asking 'anything new?'. Swapping polling for WebSockets and Redis Pub/Sub cut backend traffic by 80%.",
  openGraph: {
    type: "article",
    title: "We were polling our own database to death",
    description:
      "How swapping polling for WebSockets and Redis Pub/Sub cut our backend traffic by 80%.",
  },
};

export default function KillingPolling() {
  return (
    <ArticleLayout
      tag="Real-time · Systems"
      date="June 2026"
      read="7 min read"
      title="We were polling our own database to death"
    >
      <Lead>
        <p>
          A clinician pinged me on a Tuesday to say the dashboard felt &ldquo;laggy.&rdquo; It
          wasn&apos;t, really. The page was fine. The problem was on our side, and it was quietly
          cooking the database.
        </p>
      </Lead>

      <Section title="How we got there">
        <p>
          The dashboard needed to show new lab results and appointments as they came in. The first
          version did the obvious thing: every open page called <code>GET /updates</code> every three
          seconds. Honestly that&apos;s fine when ten people are using it. Nobody notices.
        </p>
        <p>
          Then more wards came online. And here&apos;s the thing about polling that you don&apos;t feel
          until it&apos;s too late: the traffic scales with the number of clients, not with how often
          anything actually changes. A few hundred clinicians, each polling every three seconds, is
          thousands of requests a minute. The vast majority of them got the same answer back: nothing
          new. We were paying full price to hit the database and check a timestamp, over and over,
          mostly to hear &ldquo;no.&rdquo;
        </p>
      </Section>

      <Section title="Push instead of pull">
        <p>
          The fix sounds obvious once you say it out loud. Stop asking. Get told. A WebSocket holds one
          connection open, and when something actually changes, the server pushes it down. Now traffic
          scales with <em>events</em>, not clients. A quiet ward sends almost nothing across the wire.
          A busy one sends exactly as much as it needs to.
        </p>
      </Section>

      <Section title="The part that actually bit me">
        <p>
          Here&apos;s what the &ldquo;add WebSockets&rdquo; tutorials skip. We don&apos;t run one API
          server, we run several behind a load balancer. A clinician&apos;s socket lives on instance A.
          But the write that should notify them, say a lab result landing, might be handled by instance
          B. Instance B has no idea that A is holding that socket. So the push goes nowhere and the user
          sees nothing.
        </p>
        <p>
          Redis Pub/Sub is the glue. On any write worth broadcasting, the handling instance publishes to
          a channel. Every instance subscribes to that channel at startup. So when B publishes
          &ldquo;patient 4123 changed,&rdquo; A hears about it and pushes to the sockets it actually owns.
        </p>
        <Code>{`// whichever instance handled the write:
await redis.publish("patient-updates", JSON.stringify({ patientId, kind }));

// every instance, once at startup:
sub.subscribe("patient-updates");
sub.on("message", (_channel, raw) => {
  const evt = JSON.parse(raw);
  for (const ws of socketsFor(evt.patientId)) {
    ws.send(raw); // only the sockets this instance owns
  }
});`}</Code>
        <p>
          That&apos;s the whole trick. Redis fans the event out to every instance; each instance only
          talks to its own connections. Nobody has to know where any given socket lives.
        </p>
      </Section>

      <Section title="What it bought us">
        <p>
          Backend traffic dropped by about 80%. The database CPU graph, which used to look like an EKG,
          went flat. And the dashboard genuinely felt instant, because an update now arrives the moment
          it happens instead of up to three seconds later. We removed load and made the product better
          at the same time, which doesn&apos;t happen often.
        </p>
      </Section>

      <Section title="The honest catch">
        <p>
          WebSockets are not free. You take on reconnection logic, auth at connect time, either sticky
          sessions or a shared registry, and a whole socket layer you now have to scale and watch. If a
          ten-second poll is genuinely good enough for what you&apos;re building, use the poll and go
          home. We didn&apos;t switch because push is fashionable. We switched because the polling was
          measurably hurting us, and the graph proved it.
        </p>
        <p className="text-slate-400">
          Polling is what you build when you don&apos;t know what changed. The real fix is to know.
        </p>
      </Section>
    </ArticleLayout>
  );
}
