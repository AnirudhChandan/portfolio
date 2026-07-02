import { NextResponse } from "next/server";
import { demoLimiter } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/ip";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// A genuinely rate-limited endpoint backing the interactive demo. Hammer it and
// you get real 429s with real X-RateLimit-* headers — a live token bucket.
export async function GET(request: Request) {
  const rl = demoLimiter();
  if (!rl) {
    return NextResponse.json(
      { configured: false, message: "Rate limiter needs Upstash Redis env vars." },
      { status: 200, headers: { "cache-control": "no-store" } },
    );
  }

  const ip = getClientIp(request);
  const { success, limit, remaining, reset } = await rl.limit(`demo:${ip}`);

  return NextResponse.json(
    { configured: true, success, limit, remaining, reset },
    {
      status: success ? 200 : 429,
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(reset),
        "cache-control": "no-store",
      },
    },
  );
}
