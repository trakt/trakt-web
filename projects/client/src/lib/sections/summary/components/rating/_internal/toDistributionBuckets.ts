import type { MediaRating } from '$lib/requests/models/MediaRating.ts';

type TraktDistribution = NonNullable<MediaRating['trakt']>['distribution'];
type DistributionKey = keyof TraktDistribution;

const DISTRIBUTION_KEYS: readonly DistributionKey[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
];

// Ratings come back on a 1-10 scale; the UI renders them as 5 stars, so each
// distribution key represents a half-star step.
const STARS_PER_KEY = 0.5;

export function toDistributionBuckets(distribution: TraktDistribution | Nil) {
  return DISTRIBUTION_KEYS.map((key) => ({
    star: Number(key) * STARS_PER_KEY,
    value: distribution?.[key] ?? 0,
  }));
}
