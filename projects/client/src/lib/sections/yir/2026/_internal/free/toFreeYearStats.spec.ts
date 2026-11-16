import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { describe, expect, it } from 'vitest';
import { toFreeYearStats } from './toFreeYearStats.ts';

const history: UserHistory = {
  movies: new Map([
    [
      10,
      {
        id: 10,
        plays: 3,
        watchedAt: new Date(2026, 2, 4, 20),
        watchedDates: [
          new Date(2025, 11, 31, 22),
          new Date(2026, 2, 3, 20),
          new Date(2026, 2, 4, 20),
        ],
      },
    ],
  ]),
  shows: new Map([
    [
      20,
      {
        id: 20,
        watchedAt: new Date(2026, 2, 5, 21),
        episodes: [],
        playsPerSeason: new Map(),
        watchedDates: [
          new Date(2026, 0, 1, 0, 42),
          new Date(2026, 2, 5, 21),
          new Date(2026, 2, 5, 22),
        ],
      },
    ],
  ]),
};

const ratings = {
  movies: new Map([[10, { id: 10, rating: 8, ratedAt: new Date(2026, 2, 4) }]]),
  shows: new Map([[20, { id: 20, rating: 6, ratedAt: new Date(2025, 5, 1) }]]),
  seasons: new Map([
    [30, { id: 30, rating: 9, ratedAt: new Date(2026, 1, 1) }],
  ]),
  episodes: new Map(),
};

const favorites = {
  movies: new Map([[10, { id: 10, favoritedAt: new Date(2026, 4, 1) }]]),
  shows: new Map([[20, { id: 20, favoritedAt: new Date(2024, 4, 1) }]]),
};

describe('toFreeYearStats', () => {
  const stats = toFreeYearStats({ history, ratings, favorites, year: 2026 });

  it('should bucket only plays from the year by month', () => {
    expect(stats.monthPlays).to.deep.equal([
      1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('should bucket plays by weekday', () => {
    expect(stats.weekdayPlays.reduce((a, b) => a + b, 0)).to.equal(5);
    expect(stats.weekdayPlays.at(new Date(2026, 2, 5).getDay())).to.equal(3);
  });

  it('should find the longest run of consecutive play days', () => {
    expect(stats.streak?.days).to.equal(3);
    expect(stats.streak?.start).to.deep.equal(new Date(2026, 2, 3));
    expect(stats.streak?.end).to.deep.equal(new Date(2026, 2, 5));
  });

  it('should find the first play of the year', () => {
    expect(stats.firstPlay).to.deep.equal(new Date(2026, 0, 1, 0, 42));
  });

  it('should summarize ratings given in the year', () => {
    expect(stats.ratings.count).to.equal(2);
    expect(stats.ratings.average).to.equal(8.5);
    expect(stats.ratings.distribution.at(7)).to.equal(1);
    expect(stats.ratings.distribution.at(8)).to.equal(1);
  });

  it('should count favorites added in the year', () => {
    expect(stats.favorites).to.equal(1);
  });

  it('should return empty stats when nothing was watched', () => {
    const empty = toFreeYearStats({
      history: { movies: new Map(), shows: new Map() },
      ratings: null,
      favorites: null,
      year: 2026,
    });

    expect(empty.streak).to.equal(null);
    expect(empty.firstPlay).to.equal(null);
    expect(empty.ratings.count).to.equal(0);
  });
});
