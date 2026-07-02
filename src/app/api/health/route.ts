import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Approximate uptime of this serverless instance.
const BOOT = Date.now();

export async function GET(request: Request) {
  const redis = getRedis();
  let totalRequests: number | null = null;
  let status: "operational" | "degraded" = "operational";

  if (redis) {
    try {
      totalRequests = await redis.incr("metrics:requests:total");
    } catch {
      status = "degraded";
    }
  }

  const city = request.headers.get("x-vercel-ip-city");
  const country = request.headers.get("x-vercel-ip-country");
  const location = city ? `${city}${country ? ", " + country : ""}` : "Localhost";

  return NextResponse.json(
    {
      status,
      location,
      totalRequests,
      uptimeMs: Date.now() - BOOT,
      timestamp: Date.now(),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
