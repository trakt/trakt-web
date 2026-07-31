import { time } from '$lib/utils/timing/time.ts';

const recentFeatureWindowMs = time.days(1);

export function isRecentlyAddedFeature(addedAt: Date | Nil): boolean {
  if (!addedAt) {
    return false;
  }

  const elapsed = Date.now() - addedAt.getTime();

  return elapsed >= 0 && elapsed <= recentFeatureWindowMs;
}
