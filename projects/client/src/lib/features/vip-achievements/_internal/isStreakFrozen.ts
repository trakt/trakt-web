import { GRACE_PERIOD_MS } from './constants.ts';

type IsStreakFrozenParams = {
  /** When the current VIP membership expires (or expired). */
  expiresAt: Date | null;
  /** Reference "now" as epoch milliseconds. */
  now: number;
};

/**
 * A streak is frozen when the membership has already lapsed but we are still
 * within the grace window after expiry. Before expiry the streak is simply
 * active; after the grace window it has reset (no longer frozen).
 */
export function isStreakFrozen(
  { expiresAt, now }: IsStreakFrozenParams,
): boolean {
  if (!expiresAt) {
    return false;
  }

  const expiry = expiresAt.getTime();
  if (Number.isNaN(expiry)) {
    return false;
  }

  const graceEnd = expiry + GRACE_PERIOD_MS;
  return now > expiry && now <= graceEnd;
}
