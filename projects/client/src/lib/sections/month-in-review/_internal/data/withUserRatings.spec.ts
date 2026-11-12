import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { describe, expect, it } from 'vitest';
import { toMonthReviewFromWatched } from './toMonthReviewFromWatched.ts';
import { withUserRatings } from './withUserRatings.ts';

const watchedAt = new Date(2026, 9, 4);

const ratings: UserRatings = {
  movies: new Map([[10, { id: 10, rating: 8, ratedAt: new Date() }]]),
  shows: new Map(),
  seasons: new Map(),
  episodes: new Map(),
};

describe('util: withUserRatings', () => {
  const review = withUserRatings({
    review: toMonthReviewFromWatched({
      history: {
        movies: new Map([
          [10, { id: 10, plays: 1, watchedAt, watchedDates: [watchedAt] }],
        ]),
        shows: new Map([
          [
            20,
            {
              id: 20,
              watchedAt,
              episodes: [],
              playsPerSeason: new Map(),
              watchedDates: [watchedAt],
            },
          ],
        ]),
      },
      year: 2026,
      month: 10,
    }),
    ratings,
  });

  it('should add the user rating to rated titles', () => {
    const rated = review.titles.find(({ key }) => key === 'movie-10');

    expect(rated?.rating).toBe(8);
  });

  it('should list watched titles without a rating as unrated', () => {
    expect(review.unrated?.map(({ key }) => key)).toEqual(['show-20']);
  });
});
