import { MovieHereticRatingsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticRatingsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toDistributionBuckets } from './toDistributionBuckets.ts';

describe('util: toDistributionBuckets', () => {
  it('should map each distribution key to a half star bucket', () => {
    const buckets = toDistributionBuckets(
      MovieHereticRatingsMappedMock.trakt?.distribution,
    );

    expect(buckets).toEqual([
      { star: 0.5, value: 22 },
      { star: 1, value: 20 },
      { star: 1.5, value: 31 },
      { star: 2, value: 60 },
      { star: 2.5, value: 195 },
      { star: 3, value: 637 },
      { star: 3.5, value: 1265 },
      { star: 4, value: 968 },
      { star: 4.5, value: 329 },
      { star: 5, value: 262 },
    ]);
  });

  it('should default missing keys to zero votes', () => {
    const buckets = toDistributionBuckets({ '10': 5 });

    expect(buckets.at(-1)).toEqual({ star: 5, value: 5 });
    expect(
      buckets.slice(0, -1).every((bucket) => bucket.value === 0),
    ).toBe(true);
  });

  it('should return empty buckets when the distribution is missing', () => {
    const buckets = toDistributionBuckets(undefined);

    expect(buckets).toHaveLength(10);
    expect(buckets.every((bucket) => bucket.value === 0)).toBe(true);
  });
});
