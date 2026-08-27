/**
 * Fixed-window per-key throttle.
 *
 * NOTE: this is in-memory and therefore per-serverless-instance — on Vercel,
 * concurrent invocations each get their own counter and counters reset on cold
 * start. Good enough to blunt casual abuse of a demo; for real protection use
 * a shared store (Vercel KV / Upstash Redis).
 */
export type RateLimiter = {
  /** Returns true if the request is allowed, false if the key is over budget. */
  check: (key: string) => boolean;
};

export function createRateLimiter({
  limit,
  windowMs,
  now = Date.now,
}: {
  limit: number;
  windowMs: number;
  now?: () => number;
}): RateLimiter {
  const hits = new Map<string, { count: number; windowStart: number }>();

  return {
    check(key: string): boolean {
      const t = now();
      const entry = hits.get(key);
      if (!entry || t - entry.windowStart >= windowMs) {
        // Opportunistic cleanup so the map can't grow unbounded.
        if (hits.size > 1000) {
          for (const [k, v] of hits) {
            if (t - v.windowStart >= windowMs) hits.delete(k);
          }
        }
        hits.set(key, { count: 1, windowStart: t });
        return true;
      }
      entry.count += 1;
      return entry.count <= limit;
    },
  };
}
