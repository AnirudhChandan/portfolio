export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  read: string;
  tag: string;
}

// Newest first. The blog index, article headers, prev/next links, the home-page
// teaser and the sitemap all read from this list.
export const posts: PostMeta[] = [
  {
    slug: "pydb-crash-test",
    title: "My database lost every committed write, and one test found it",
    excerpt:
      "PyDB had a write-ahead log, fsync on every commit, and a README promising crash recovery. The first time I killed it mid-workload, 50 committed rows came back as zero.",
    date: "September 2026",
    read: "8 min read",
    tag: "Databases · Testing",
  },
  {
    slug: "row-level-security",
    title: "Row-level security: the tenant check you can't forget",
    excerpt:
      "Cross-tenant leaks come from one missing WHERE clause. PostgreSQL can enforce the check for you, if you avoid the quiet ways row-level security switches itself off.",
    date: "September 2026",
    read: "7 min read",
    tag: "Security · PostgreSQL",
  },
  {
    slug: "absence-timers",
    title: "Alerting on something that didn't happen",
    excerpt:
      "An AI camera can tell you someone climbed a fence. It can't tell you the guard never walked past. Timers over missing events: late messages, restarts, one alert per lapse.",
    date: "September 2026",
    read: "7 min read",
    tag: "Event systems · Reliability",
  },
  {
    slug: "consistent-hashing",
    title: "Add one server, move 90% of your keys",
    excerpt:
      "hash(key) % N falls apart the moment N changes. Measured numbers from a consistent-hash ring, virtual nodes, and why the hash function matters more than you'd expect.",
    date: "September 2026",
    read: "7 min read",
    tag: "Distributed Systems",
  },
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
    date: "July 2026",
    read: "7 min read",
    tag: "Real-time · Systems",
  },
  {
    slug: "exactly-once-kafka",
    title: "Exactly-once is mostly a marketing slide",
    excerpt:
      "A deploy blipped and some tax records got processed twice. Here's how I stopped chasing 'exactly-once' and built consumers that just don't care about duplicates.",
    date: "July 2026",
    read: "8 min read",
    tag: "Distributed Systems · Kafka",
  },
  {
    slug: "n-plus-one",
    title: "53 endpoints, one lazy loop, 15.6 seconds",
    excerpt:
      "One page took 15.6 seconds to load. It wasn't a slow query. It was 101 fast ones. A short story about the N+1 problem and counting your round trips.",
    date: "July 2026",
    read: "6 min read",
    tag: "Performance · Databases",
  },
  {
    slug: "lost-update",
    title: "Two requests, one row, and a lost update",
    excerpt:
      "Two people saved the same record a second apart and one edit silently vanished. On the lost-update race, optimistic concurrency, and when to reach for a distributed lock.",
    date: "July 2026",
    read: "7 min read",
    tag: "Concurrency · Systems",
  },
  {
    slug: "retry-storms",
    title: "Your retry logic is a small DDoS you wrote yourself",
    excerpt:
      "A downstream service hiccuped for thirty seconds. Our retries turned it into a four-minute outage. On backoff, jitter, knowing when to quit, and the dead-letter queue.",
    date: "July 2026",
    read: "6 min read",
    tag: "Resilience · Systems",
  },
];
