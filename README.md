# anirudh-chandan.vercel.app

My personal site. It is also where a few of my projects run live in the
browser instead of sitting in a repo.

**Live:** https://anirudh-chandan.vercel.app

## What's in it

- **`/lab`** — interactive demos backed by real code in `src/lib`:
  - `src/lib/pydb` — a TypeScript port of [PyDB](https://github.com/AnirudhChandan/PyDB):
    pager, B-Tree and write-ahead log, with a storage visualiser on top.
  - `src/lib/sharding` — consistent-hash ring and shard routing demo.
  - A token-bucket rate limiter you can hit (`/api/demo/rate-limit`, Upstash Redis).
- **`/blog`** — write-ups on exactly-once Kafka processing, lost updates,
  N+1 queries, retry storms, replacing polling with push, and building PyDB.
- **API routes** — contact form (Resend, rate limited, zod-validated),
  health and stats endpoints.

## Stack

Next.js (App Router), TypeScript, Tailwind, Upstash Redis, Resend, Vitest.
CI runs typecheck, unit tests and a production build on every push.

## Run it

```bash
npm install
cp .env.example .env.local   # Upstash + Resend keys; see comments in the file
npm run dev
npm test
```
