import { describe, expect, it, vi } from 'vitest';

vi.mock('$lib/features/i18n/messages.ts', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    text_stats_genre_other: () => 'Other',
  };
});

import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import type { ShowActivityHistory } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { computeGenreBreakdown, DAY_COUNT } from './useGenreBreakdown.ts';

function movieWith(
  watchedAt: Date,
  genres: string[],
): MovieActivityHistory {
  return { watchedAt, movie: { genres } } as unknown as MovieActivityHistory;
}

function showWith(
  watchedAt: Date,
  genres: string[],
): ShowActivityHistory {
  return { watchedAt, show: { genres } } as unknown as ShowActivityHistory;
}

describe('computeGenreBreakdown', () => {
  const now = new Date('2024-01-15T12:00:00Z');

  it('returns 14 days with empty data', () => {
    const result = computeGenreBreakdown([], [], now);
    expect(result.days).toHaveLength(DAY_COUNT);
    expect(result.maxDayTotal).toBe(0);
    expect(result.legend).toHaveLength(0);
  });

  it('groups genres by day', () => {
    const movies = [
      movieWith(new Date('2024-01-15T10:00:00Z'), ['action']),
      movieWith(new Date('2024-01-15T14:00:00Z'), ['action']),
      movieWith(new Date('2024-01-14T10:00:00Z'), ['comedy']),
    ];
    const result = computeGenreBreakdown(movies, [], now);

    const today = result.days[DAY_COUNT - 1]!;
    expect(today.total).toBe(2);

    const yesterday = result.days[DAY_COUNT - 2]!;
    expect(yesterday.total).toBe(1);
  });

  it('limits to top 5 genres plus other', () => {
    const genres = [
      'action', 'comedy', 'drama', 'horror', 'sci-fi', 'romance', 'thriller',
    ];
    const movies = genres.map((g) =>
      movieWith(new Date('2024-01-15T10:00:00Z'), [g]),
    );
    const result = computeGenreBreakdown(movies, [], now);
    expect(result.legend.length).toBeLessThanOrEqual(6);
  });

  it('handles entries with no genres as other', () => {
    const movies = [
      movieWith(new Date('2024-01-15T10:00:00Z'), []),
    ];
    const result = computeGenreBreakdown(movies, [], now);
    expect(result.legend).toHaveLength(1);
    expect(result.legend[0]!.genre).toBe('other');
  });

  it('includes show genres from the show field', () => {
    const shows = [
      showWith(new Date('2024-01-15T10:00:00Z'), ['drama']),
    ];
    const result = computeGenreBreakdown([], shows, now);
    expect(result.legend).toHaveLength(1);
    expect(result.legend[0]!.genre).toBe('drama');
  });

  it('ignores entries outside the 14-day window', () => {
    const movies = [
      movieWith(new Date('2023-12-01T10:00:00Z'), ['action']),
    ];
    const result = computeGenreBreakdown(movies, [], now);
    expect(result.maxDayTotal).toBe(0);
    expect(result.legend).toHaveLength(0);
  });

  it('assigns colors to legend entries', () => {
    const movies = [
      movieWith(new Date('2024-01-15T10:00:00Z'), ['action']),
      movieWith(new Date('2024-01-15T11:00:00Z'), ['comedy']),
    ];
    const result = computeGenreBreakdown(movies, [], now);
    result.legend.forEach((entry) => {
      expect(entry.color).toMatch(/^#[0-9a-f]{6}$/);
    });
  });

  it('calculates percentages that reflect genre distribution', () => {
    const movies = [
      movieWith(new Date('2024-01-15T10:00:00Z'), ['action']),
      movieWith(new Date('2024-01-15T11:00:00Z'), ['action']),
      movieWith(new Date('2024-01-15T12:00:00Z'), ['comedy']),
    ];
    const result = computeGenreBreakdown(movies, [], now);
    const actionEntry = result.legend.find((l) => l.genre === 'action');
    const comedyEntry = result.legend.find((l) => l.genre === 'comedy');
    expect(actionEntry!.percentage).toBe(67);
    expect(comedyEntry!.percentage).toBe(33);
  });
});
