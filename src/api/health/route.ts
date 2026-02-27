import { NextResponse } from "next/server";

export const runtime = "edge"; // Use Edge for lowest latency

export async function GET(request: Request) {
  // Simulate DB/Cache check
  const dbStatus = Math.random() > 0.98 ? "degraded" : "operational"; // 2% chance of simulated hiccup

  // Extract geo info from Vercel/Cloudflare headers
  // Fallback to "Unknown" if running locally
  const city = request.headers.get("x-vercel-ip-city") || "Unknown Region";
  const country = request.headers.get("x-vercel-ip-country") || "Earth";

  return NextResponse.json({
    status: dbStatus,
    location: city === "Unknown Region" ? "Localhost" : `${city}, ${country}`,
    timestamp: Date.now(),
  });
}
