// Best-effort client IP from proxy headers (Vercel sets x-forwarded-for).
export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}
