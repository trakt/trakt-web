import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { describe, expect, it } from 'vitest';
import {
  countInstantVerdicts,
  countLowRatings,
  countStarLevels,
} from './ratingMetrics.ts';

const rated = (id: number, rating: number, ratedAt = new Date(0)) =>
  [id, { id, rating, ratedAt }] as const;

function makeRatings(
  movies: ReadonlyArray<
    readonly [number, { id: number; rating: number; ratedAt: Date }]
  >,
  episodes: ReadonlyArray<number> = [],
): UserRatings {
  return {
    movies: new Map(movies),
    shows: new Map(),
    seasons: new Map(),
    episodes: new Map(
      episodes.map((rating, index) => rated(1_000 + index, rating)),
    ),
  };
}

function makeHistory(movieId: number, watchedAt: Date): UserHistory {
  return {
    movies: new Map([
      [
        movieId,
        { id: movieId, watchedAt, plays: 1, watchedDates: [watchedAt] },
      ],
    ]),
    shows: new Map(),
  };
}

describe('util: ratingMetrics', () => {
  it('should count star levels, two rating points per star', () => {
    const ratings = makeRatings([rated(1, 1), rated(2, 2)], [3, 6, 9, 10]);

    expect(countStarLevels(ratings)).toBe(4);
  });

  it('should count 1 and 2 star ratings as low', () => {
    const ratings = makeRatings([rated(1, 4), rated(2, 5)], [1]);

    expect(countLowRatings(ratings)).toBe(2);
  });

  it('should count movies rated within an hour after a play', () => {
    const watchedAt = new Date('2026-07-01T20:00:00Z');
    const history = makeHistory(1, watchedAt);
    const quick = makeRatings([rated(1, 8, new Date('2026-07-01T20:59:00Z'))]);
    const late = makeRatings([rated(1, 8, new Date('2026-07-01T21:01:00Z'))]);
    const early = makeRatings([rated(1, 8, new Date('2026-07-01T19:59:00Z'))]);

    expect(countInstantVerdicts({ history, ratings: quick })).toBe(1);
    expect(countInstantVerdicts({ history, ratings: late })).toBe(0);
    expect(countInstantVerdicts({ history, ratings: early })).toBe(0);
  });

  it('should degrade to 0 without data', () => {
    expect(countStarLevels(null)).toBe(0);
    expect(countLowRatings(undefined)).toBe(0);
    expect(countInstantVerdicts({ history: null, ratings: null })).toBe(0);
  });
});
