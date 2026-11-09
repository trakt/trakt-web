import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  computeLongestStreak,
  computeLongestWeeklyRun,
  countActiveDays,
  countDoubleFeatures,
  countEarlyBirdPlays,
  countLeapDayPlays,
  countLongHaulShows,
  countMarathonDays,
  countNewYearPlays,
  countNightOwlPlays,
  countSameDayMovieRewatches,
} from './historyMetrics.ts';

const at = (iso: string) => new Date(iso);

function makeHistory(
  movies: Array<{ id: number; dates: Date[] }>,
  shows: Array<{ id: number; episodeDates: Date[] }> = [],
): UserHistory {
  return {
    movies: new Map(
      movies.map((movie) => [
        movie.id,
        {
          id: movie.id,
          watchedAt: movie.dates.at(-1) ?? at('2020-01-01T00:00:00Z'),
          plays: movie.dates.length,
          watchedDates: movie.dates,
        },
      ]),
    ),
    shows: new Map(
      shows.map((show) => [
        show.id,
        {
          id: show.id,
          watchedAt: at('2020-01-01T00:00:00Z'),
          episodes: show.episodeDates.map((date, index) => ({
            season: 1,
            episodeId: index,
            watchedAt: date,
            plays: 1,
          })),
          watchedDates: show.episodeDates,
          playsPerSeason: new Map<number, number>(),
        },
      ]),
    ),
  };
}

describe('util: historyMetrics', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('computeLongestStreak finds the longest consecutive run', () => {
    const history = makeHistory([
      { id: 1, dates: [at('2026-07-01T10:00:00Z')] },
      { id: 2, dates: [at('2026-07-02T10:00:00Z')] },
      { id: 3, dates: [at('2026-07-03T10:00:00Z')] },
      // gap
      { id: 4, dates: [at('2026-07-10T10:00:00Z')] },
    ]);

    expect(computeLongestStreak(history)).toBe(3);
  });

  it('countNightOwlPlays counts midnight-04:00 plays only', () => {
    const history = makeHistory([
      {
        id: 1,
        dates: [at('2026-07-30T00:10:00Z'), at('2026-07-30T14:00:00Z')],
      },
      { id: 2, dates: [at('2026-07-31T03:59:00Z')] },
      { id: 3, dates: [at('2026-07-31T04:00:00Z')] },
    ]);

    expect(countNightOwlPlays(history)).toBe(2);
  });

  it("countNightOwlPlays reads the hour in the member's timezone", () => {
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-120);
    const history = makeHistory([
      { id: 1, dates: [at('2026-07-30T22:30:00Z')] },
      { id: 2, dates: [at('2026-07-30T02:30:00Z')] },
    ]);

    expect(countNightOwlPlays(history)).toBe(1);
  });

  it("computeLongestStreak buckets days in the member's timezone", () => {
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-120);
    const history = makeHistory([
      { id: 1, dates: [at('2026-07-01T10:00:00Z')] },
      { id: 2, dates: [at('2026-07-02T23:00:00Z')] },
    ]);

    expect(computeLongestStreak(history)).toBe(1);
  });

  it('countDoubleFeatures counts days with 2+ distinct movies', () => {
    const history = makeHistory([
      { id: 1, dates: [at('2026-07-30T10:00:00Z')] },
      { id: 2, dates: [at('2026-07-30T13:00:00Z')] },
      { id: 3, dates: [at('2026-07-31T10:00:00Z')] }, // lone movie that day
    ]);

    expect(countDoubleFeatures(history)).toBe(1);
  });

  it('countMarathonDays counts show/day pairs with 8+ episodes', () => {
    const dates = Array.from({ length: 9 }, (_, i) =>
      at(`2026-07-30T${String(i + 8).padStart(2, '0')}:00:00Z`),
    );
    const history = makeHistory([], [{ id: 1, episodeDates: dates }]);

    expect(countMarathonDays(history)).toBe(1);
  });

  it('degrades to 0 with no history', () => {
    expect(computeLongestStreak(null)).toBe(0);
    expect(countNightOwlPlays(undefined)).toBe(0);
    expect(countDoubleFeatures(null)).toBe(0);
    expect(countMarathonDays(null)).toBe(0);
    expect(countActiveDays(null)).toBe(0);
    expect(computeLongestWeeklyRun(null)).toBe(0);
    expect(countEarlyBirdPlays(null)).toBe(0);
    expect(countLongHaulShows(null)).toBe(0);
    expect(countNewYearPlays(null)).toBe(0);
    expect(countLeapDayPlays(null)).toBe(0);
    expect(countSameDayMovieRewatches(null)).toBe(0);
  });

  it('countActiveDays counts different days, not plays', () => {
    const history = makeHistory([
      {
        id: 1,
        dates: [at('2026-07-01T10:00:00Z'), at('2026-07-01T20:00:00Z')],
      },
      { id: 2, dates: [at('2026-07-03T10:00:00Z')] },
    ]);

    expect(countActiveDays(history)).toBe(2);
  });

  it('computeLongestWeeklyRun counts Monday-to-Sunday weeks in a row', () => {
    const history = makeHistory([
      // Sunday 5 July and Monday 6 July sit in different weeks.
      { id: 1, dates: [at('2026-07-05T10:00:00Z')] },
      { id: 2, dates: [at('2026-07-06T10:00:00Z')] },
      { id: 3, dates: [at('2026-07-15T10:00:00Z')] },
      // gap: no play in the week of 20 July
      { id: 4, dates: [at('2026-07-28T10:00:00Z')] },
    ]);

    expect(computeLongestWeeklyRun(history)).toBe(3);
  });

  it('countEarlyBirdPlays counts plays from 05:00 up to 08:00', () => {
    const history = makeHistory([
      {
        id: 1,
        dates: [
          at('2026-07-30T04:59:00Z'),
          at('2026-07-30T05:00:00Z'),
          at('2026-07-30T07:59:00Z'),
          at('2026-07-30T08:00:00Z'),
        ],
      },
    ]);

    expect(countEarlyBirdPlays(history)).toBe(2);
  });

  it('countLongHaulShows counts shows with 100 or more episodes', () => {
    const episodes = (count: number) =>
      Array.from({ length: count }, (_, i) =>
        at(`2026-01-01T00:00:${String(i % 60).padStart(2, '0')}Z`),
      );
    const history = makeHistory(
      [],
      [
        { id: 1, episodeDates: episodes(100) },
        { id: 2, episodeDates: episodes(99) },
      ],
    );

    expect(countLongHaulShows(history)).toBe(1);
  });

  it('countNewYearPlays counts the hour either side of midnight', () => {
    const history = makeHistory([
      {
        id: 1,
        dates: [
          at('2025-12-31T22:59:00Z'),
          at('2025-12-31T23:30:00Z'),
          at('2026-01-01T00:45:00Z'),
          at('2026-01-01T01:00:00Z'),
        ],
      },
    ]);

    expect(countNewYearPlays(history)).toBe(2);
  });

  it("countNewYearPlays reads midnight in the member's timezone", () => {
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-60);
    const history = makeHistory([
      { id: 1, dates: [at('2025-12-31T23:30:00Z')] },
    ]);

    expect(countNewYearPlays(history)).toBe(1);
  });

  it('countLeapDayPlays counts plays on 29 February only', () => {
    const history = makeHistory([
      {
        id: 1,
        dates: [at('2028-02-29T12:00:00Z'), at('2028-03-01T00:30:00Z')],
      },
    ]);

    expect(countLeapDayPlays(history)).toBe(1);
  });

  it('countSameDayMovieRewatches counts movies played twice in one day', () => {
    const history = makeHistory([
      {
        id: 1,
        dates: [at('2026-07-01T10:00:00Z'), at('2026-07-01T21:00:00Z')],
      },
      {
        id: 2,
        dates: [at('2026-07-01T10:00:00Z'), at('2026-07-02T10:00:00Z')],
      },
    ]);

    expect(countSameDayMovieRewatches(history)).toBe(1);
  });
});
