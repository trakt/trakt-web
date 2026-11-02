import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { describe, expect, it } from 'vitest';
import { toMonthReviewFromWatched } from './toMonthReviewFromWatched.ts';

const history: UserHistory = {
  movies: new Map([
    [
      10,
      {
        id: 10,
        plays: 2,
        watchedAt: new Date(2026, 9, 5, 21),
        watchedDates: [new Date(2026, 8, 30, 21), new Date(2026, 9, 5, 21)],
      },
    ],
    [
      11,
      {
        id: 11,
        plays: 1,
        watchedAt: new Date(2026, 8, 2),
        watchedDates: [new Date(2026, 8, 2)],
      },
    ],
  ]),
  shows: new Map([
    [
      20,
      {
        id: 20,
        watchedAt: new Date(2026, 9, 3, 23),
        episodes: [],
        playsPerSeason: new Map(),
        watchedDates: [new Date(2026, 9, 3, 10), new Date(2026, 9, 3, 23)],
      },
    ],
  ]),
};

const review = toMonthReviewFromWatched({ history, year: 2026, month: 10 });

describe('util: toMonthReviewFromWatched', () => {
  it('should only count plays inside the month', () => {
    expect(review.tier).toBe('free');
    expect(review.plays).toBe(3);
    expect(review.episodes).toBe(2);
    expect(review.movies).toBe(1);
    expect(review.shows).toBe(1);
  });

  it('should count active days by calendar day', () => {
    expect(review.activeDays).toBe(2);
  });

  it('should list each title once, newest first, with its plays', () => {
    expect(review.titles.map(({ key, plays }) => ({ key, plays }))).toEqual([
      { key: 'movie-10', plays: 1 },
      { key: 'show-20', plays: 2 },
    ]);
  });

  it('should build poster urls from the type and id', () => {
    expect(review.titles.at(0)?.poster).toBe(
      'https://media.trakt.tv/movies/10/medium/poster.webp',
    );
  });
});
