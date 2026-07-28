import { time } from '$lib/utils/timing/time.ts';

// Past this with no fresh server response, projecting further would be
// fabricating signups the server never reported. Only reachable when polling is
// broken: a healthy poll refreshes `updated_at` every 10s, and it stays fresh
// even while the reported total is frozen.
const MAX_ANCHOR_AGE = time.minutes(5);

/**
 * Whether the last server response is too old to keep projecting from.
 */
export function isAnchorStale(
  { anchoredAt, now }: { anchoredAt: number; now: number },
): boolean {
  return now - anchoredAt > MAX_ANCHOR_AGE;
}
