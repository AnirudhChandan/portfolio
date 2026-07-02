import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "./redis";

// Named limiters, created lazily. Each returns null when Redis isn't configured,
// letting callers degrade gracefully instead of crashing.
const cache = new Map<string, Ratelimit>();

function limiter(name: string, build: () => Ratelimit["limiter"]): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  let rl = cache.get(name);
  if (!rl) {
    rl = new Ratelimit({ redis, limiter: build(), prefix: `rl:${name}`, analytics: false });
    cache.set(name, rl);
  }
  return rl;
}

// Contact form: 3 submissions / 10 minutes per IP.
export const contactLimiter = () =>
  limiter("contact", () => Ratelimit.slidingWindow(3, "10 m"));

// Public demo: a real token bucket — 5 tokens, refilling 5 every 10s, per IP.
export const demoLimiter = () =>
  limiter("demo", () => Ratelimit.tokenBucket(5, "10 s", 5));
