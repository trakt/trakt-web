type WatchingProgressParams = {
  startedAt: Date;
  expiresAt: Date;
  now: number;
};

type WatchingProgress = {
  fraction: number;
  elapsed: number;
  remaining: number;
};

export function toWatchingProgress({
  startedAt,
  expiresAt,
  now,
}: WatchingProgressParams): WatchingProgress {
  const start = startedAt.getTime();
  const total = expiresAt.getTime() - start;

  if (total <= 0) return { fraction: 1, elapsed: 0, remaining: 0 };

  const elapsed = Math.min(total, Math.max(0, now - start));

  return {
    fraction: elapsed / total,
    elapsed,
    remaining: total - elapsed,
  };
}
