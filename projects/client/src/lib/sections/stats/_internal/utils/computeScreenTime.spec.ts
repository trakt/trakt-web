import type { EpisodeActivityHistory } from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { describe, expect, it } from 'vitest';
import {
  computeDailyMinutes,
  computeTotalMinutes,
} from './computeScreenTime.ts';

function makeMovieEntry(
  watchedAt: Date,
  runtime: number,
): MovieActivityHistory {
  return {
    id: 1,
    key: 'movie-1',
    watchedAt,
    type: 'movie',
    movie: {
      id: 1,
      slug: 'movie-1',
      title: 'Movie',
      year: 2024,
      runtime,
      poster: null,
      backdrop: null,
    },
  } as unknown as MovieActivityHistory;
}

function makeShowEntry(
  watchedAt: Date,
  runtime: number,
): EpisodeActivityHistory {
  return {
    id: 2,
    key: 'show-1-s1e1',
    watchedAt,
    type: 'episode',
    episode: {
      id: 1,
      slug: 'show-1-s1e1',
      title: 'Episode',
      season: 1,
      number: 1,
      runtime,
    },
    show: {
      id: 10,
      slug: 'show-1',
      title: 'Show',
      year: 2024,
      poster: null,
      backdrop: null,
    },
  } as unknown as EpisodeActivityHistory;
}

describe('computeTotalMinutes', () => {
  it('returns 0 for empty list', () => {
    expect(computeTotalMinutes([])).toBe(0);
  });

  it('sums movie runtimes', () => {
    const entries = [
      makeMovieEntry(new Date('2024-01-15T10:00:00Z'), 120),
      makeMovieEntry(new Date('2024-01-16T10:00:00Z'), 90),
    ];
    expect(computeTotalMinutes(entries)).toBe(210);
  });

  it('sums episode runtimes', () => {
    const entries = [
      makeShowEntry(new Date('2024-01-15T10:00:00Z'), 45),
      makeShowEntry(new Date('2024-01-16T10:00:00Z'), 30),
    ];
    expect(computeTotalMinutes(entries)).toBe(75);
  });

  it('sums mixed movie and episode runtimes', () => {
    const entries = [
      makeMovieEntry(new Date('2024-01-15T10:00:00Z'), 120),
      makeShowEntry(new Date('2024-01-16T10:00:00Z'), 45),
    ];
    expect(computeTotalMinutes(entries)).toBe(165);
  });
});

describe('computeDailyMinutes', () => {
  it('returns array of 7 zeros for empty list', () => {
    const now = new Date('2024-01-21T12:00:00Z');
    const result = computeDailyMinutes([], now);
    expect(result).toHaveLength(7);
    expect(result.every((v) => v === 0)).toBe(true);
  });

  it('assigns minutes to correct day bucket', () => {
    const now = new Date('2024-01-21T12:00:00Z');
    const entries = [
      makeMovieEntry(new Date('2024-01-21T10:00:00Z'), 120),
    ];
    const result = computeDailyMinutes(entries, now);
    expect(result[6]).toBe(120);
  });

  it('aggregates multiple entries on same day', () => {
    const now = new Date('2024-01-21T12:00:00Z');
    const entries = [
      makeMovieEntry(new Date('2024-01-21T09:00:00Z'), 90),
      makeShowEntry(new Date('2024-01-21T20:00:00Z'), 45),
    ];
    const result = computeDailyMinutes(entries, now);
    expect(result[6]).toBe(135);
  });

  it('ignores entries outside the 7-day window', () => {
    const now = new Date('2024-01-21T12:00:00Z');
    const entries = [
      makeMovieEntry(new Date('2024-01-10T10:00:00Z'), 120),
    ];
    const result = computeDailyMinutes(entries, now);
    expect(result.every((v) => v === 0)).toBe(true);
  });
});
