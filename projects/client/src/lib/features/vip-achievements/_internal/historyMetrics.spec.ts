import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { describe, expect, it } from 'vitest';
import {
  computeLongestStreak,
  countActiveDays,
  countDoubleFeatures,
  countMarathonDays,
  countNightOwlPlays,
} from './historyMetrics.ts';

const at = (iso: string) => new Date(iso);

function makeHistory(
  movies: Array<{ id: number; dates: Date[] }>,
  shows: Array<{ id: number; episodeDates: Date[] }> = [],
): UserHistory {
  return {
    movies: new Map(
      movies.map((movie) => [movie.id, {
        id: movie.id,
        watchedAt: movie.dates.at(-1) ?? at('2020-01-01T00:00:00Z'),
        plays: movie.dates.length,
        watchedDates: movie.dates,
      }]),
    ),
    shows: new Map(
      shows.map((show) => [show.id, {
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
      }]),
    ),
  };
}

describe('util: historyMetrics', () => {
  it('countActiveDays counts distinct calendar days', () => {
    const history = makeHistory([
      {
        id: 1,
        dates: [at('2026-07-30T10:00:00Z'), at('2026-07-30T22:00:00Z')],
      },
      { id: 2, dates: [at('2026-07-31T10:00:00Z')] },
    ]);

    expect(countActiveDays(history)).toBe(2);
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

  it('countNightOwlPlays counts 01:00-04:00 plays only', () => {
    const history = makeHistory([
      {
        id: 1,
        dates: [at('2026-07-30T02:30:00Z'), at('2026-07-30T14:00:00Z')],
      },
      { id: 2, dates: [at('2026-07-31T03:59:00Z')] },
    ]);

    expect(countNightOwlPlays(history)).toBe(2);
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
    const dates = Array.from(
      { length: 9 },
      (_, i) => at(`2026-07-30T${String(i + 8).padStart(2, '0')}:00:00Z`),
    );
    const history = makeHistory([], [{ id: 1, episodeDates: dates }]);

    expect(countMarathonDays(history)).toBe(1);
  });

  it('degrades to 0 with no history', () => {
    expect(countActiveDays(null)).toBe(0);
    expect(computeLongestStreak(null)).toBe(0);
    expect(countNightOwlPlays(undefined)).toBe(0);
    expect(countDoubleFeatures(null)).toBe(0);
    expect(countMarathonDays(null)).toBe(0);
  });
});
