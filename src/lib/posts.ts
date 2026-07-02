export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  read: string;
  tag: string;
}

// Newest first. The index page renders straight from this list.
export const posts: PostMeta[] = [
  {
    slug: "building-pydb",
    title: "Building a B-Tree Storage Engine From Scratch",
    excerpt:
      "Why I built a database instead of using one: pages, a pager, a B-Tree, splits, and a Write-Ahead Log, all from first principles.",
    date: "July 2026",
    read: "9 min read",
    tag: "Systems · Databases",
  },
  {
    slug: "killing-polling",
    title: "We were polling our own database to death",
    excerpt:
      "Every dashboard hit the API every three seconds asking 'anything new?'. Swapping polling for WebSockets and Redis Pub/Sub cut backend traffic by 80%.",
    date: "June 2026",
    read: "7 min read",
    tag: "Real-time · Systems",
  },
  {
    slug: "exactly-once-kafka",
    title: "Exactly-once is mostly a marketing slide",
    excerpt:
      "A deploy blipped and some tax records got processed twice. Here's how I stopped chasing 'exactly-once' and built consumers that just don't care about duplicates.",
    date: "May 2026",
    read: "8 min read",
    tag: "Distributed Systems · Kafka",
  },
  {
    slug: "n-plus-one",
    title: "53 endpoints, one lazy loop, 15.6 seconds",
    excerpt:
      "One page took 15.6 seconds to load. It wasn't a slow query. It was 101 fast ones. A short story about the N+1 problem and counting your round trips.",
    date: "April 2026",
    read: "6 min read",
    tag: "Performance · Databases",
  },
  {
    slug: "lost-update",
    title: "Two requests, one row, and a lost update",
    excerpt:
      "Two people saved the same record a second apart and one edit silently vanished. On the lost-update race, optimistic concurrency, and when to reach for a distributed lock.",
    date: "March 2026",
    read: "7 min read",
    tag: "Concurrency · Systems",
  },
  {
    slug: "retry-storms",
    title: "Your retry logic is a small DDoS you wrote yourself",
    excerpt:
      "A downstream service hiccuped for thirty seconds. Our retries turned it into a four-minute outage. On backoff, jitter, knowing when to quit, and the dead-letter queue.",
    date: "February 2026",
    read: "6 min read",
    tag: "Resilience · Systems",
  },
];
