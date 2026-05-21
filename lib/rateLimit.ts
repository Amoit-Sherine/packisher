// Simple in-memory rate limiter — max N requests per IP per window
// Resets per window, not rolling. Good enough for a single-instance deployment.

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

const WINDOW_MS  = 60_000; // 1 minute
const MAX_HITS   = 10;

export function rateLimit(ip: string): { allowed: boolean } {
  const now = Date.now();
  const bucket = store.get(ip);

  if (!bucket || now > bucket.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  bucket.count += 1;
  if (bucket.count > MAX_HITS) {
    return { allowed: false };
  }

  return { allowed: true };
}

// Extract the real client IP from Next.js request headers
export function getIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
