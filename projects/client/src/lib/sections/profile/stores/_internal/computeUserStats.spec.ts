import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { describe, expect, it } from 'vitest';
import { computeUserStats } from './computeUserStats.ts';

const WATCHED_AT = new Date('2024-01-01T00:00:00Z');

const emptyHistory = (): UserHistory => ({
  movies: new Map(),
  shows: new Map(),
});

const emptyRatings = (): UserRatings => ({
  movies: new Map(),
  shows: new Map(),
  seasons: new Map(),
  episodes: new Map(),
});

const rated = (id: number, rating: number) =>
  [id, { id, rating, ratedAt: WATCHED_AT }] as const;

const watchedEpisode = (episodeId: number, plays: number) => ({
  season: 1,
  episodeId,
  watchedAt: WATCHED_AT,
  plays,
});

describe('computeUserStats', () => {
  it('should count movie plays, show plays and watched titles from history', () => {
    const history: UserHistory = {
      movies: new Map([
        [1, { id: 1, watchedAt: WATCHED_AT, plays: 2, watchedDates: [] }],
        [2, { id: 2, watchedAt: WATCHED_AT, plays: 1, watchedDates: [] }],
      ]),
      shows: new Map([
        [
          10,
          {
            id: 10,
            watchedAt: WATCHED_AT,
            watchedDates: [],
            playsPerSeason: new Map(),
            episodes: [watchedEpisode(100, 1), watchedEpisode(101, 3)],
          },
        ],
      ]),
    };

    const stats = computeUserStats({ history, ratings: emptyRatings() });

    expect(stats.movies.watched).toBe(2);
    expect(stats.movies.plays).toBe(3);
    expect(stats.shows.watched).toBe(1);
    expect(stats.episodes.watched).toBe(2);
    expect(stats.episodes.plays).toBe(4);
    expect(stats.totalPlays).toBe(7);
  });

  it('should total ratings across media types and bucket the distribution', () => {
    const ratings: UserRatings = {
      movies: new Map([rated(1, 8), rated(2, 8)]),
      shows: new Map([rated(10, 10)]),
      seasons: new Map([rated(20, 1)]),
      episodes: new Map([rated(100, 8)]),
    };

    const stats = computeUserStats({ history: emptyHistory(), ratings });

    expect(stats.ratings.total).toBe(5);
    expect(stats.movies.ratings).toBe(2);
    expect(stats.shows.ratings).toBe(1);
    expect(stats.seasons.ratings).toBe(1);
    expect(stats.episodes.ratings).toBe(1);
    expect(stats.ratings.distribution).toEqual({
      1: 1,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 3,
      9: 0,
      10: 1,
    });
  });

  it('should return zeros for an empty history and no ratings', () => {
    const stats = computeUserStats({
      history: emptyHistory(),
      ratings: emptyRatings(),
    });

    expect(stats.totalPlays).toBe(0);
    expect(stats.movies.watched).toBe(0);
    expect(stats.shows.watched).toBe(0);
    expect(stats.episodes.watched).toBe(0);
    expect(stats.ratings.total).toBe(0);
    expect(
      Object.values(stats.ratings.distribution).every((n) => n === 0),
    ).toBe(true);
  });
});
