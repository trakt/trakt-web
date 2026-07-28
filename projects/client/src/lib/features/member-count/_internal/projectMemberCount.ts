import type { RegisteredMemberCount } from '$lib/requests/models/RegisteredMemberCount.ts';
import { time } from '$lib/utils/timing/time.ts';

// Past this, a dead endpoint would be fabricating signups, so the counter
// freezes on the last honest value. Only reachable when polling is broken.
const MAX_PROJECTION_WINDOW = time.minutes(5);

/**
 * Project the registered total forward from the server anchor at the measured
 * signup rate. Clamped at both ends: a client clock behind the server would
 * otherwise render below the authoritative total.
 */
export function projectMemberCount(
  { anchor, now }: { anchor: RegisteredMemberCount; now: number },
): number {
  const elapsed = Math.min(
    Math.max(0, now - anchor.anchoredAt),
    MAX_PROJECTION_WINDOW,
  );

  return anchor.total + elapsed * (anchor.ratePerDay / time.days(1));
}
