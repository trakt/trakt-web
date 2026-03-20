import { describe, expect, it } from 'vitest';
import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import type { ShowActivityHistory } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import {
  computeDelta,
  countUniqueDays,
  dayOfWeekDate,
  getBusiestDay,
  maxPlaysInSingleDay,
  rankStats,
  sumHours,
  type PulseStat,
} from './pulseStats.ts';

function movieEntry(runtime: number): MovieActivityHistory {
  return { movie: { runtime } } as unknown as MovieActivityHistory;
}

function showEntry(runtime: number): ShowActivityHistory {
  return { episode: { runtime } } as unknown as ShowActivityHistory;
}

describe('sumHours', () => {
  it('returns 0 for empty arrays', () => {
    expect(sumHours([], [])).toBe(0);
  });

  it('sums movie runtimes and converts to hours', () => {
    expect(sumHours([movieEntry(120), movieEntry(60)], [])).toBe(3);
  });

  it('sums show runtimes and converts to hours', () => {
    expect(sumHours([], [showEntry(45), showEntry(45)])).toBe(2);
  });

  it('combines both and rounds', () => {
    // 150 min → 2.5 → rounds to 3
    expect(sumHours([movieEntry(100)], [showEntry(50)])).toBe(3);
  });
});

describe('countUniqueDays', () => {
  it('returns 0 for empty array', () => {
    expect(countUniqueDays([])).toBe(0);
  });

  it('counts unique days, deduping same-day entries', () => {
    const dates = [
      new Date('2024-01-15T10:00:00Z'),
      new Date('2024-01-15T14:00:00Z'),
      new Date('2024-01-16T10:00:00Z'),
    ];
    expect(countUniqueDays(dates)).toBe(2);
  });
});

describe('getBusiestDay', () => {
  it('returns null for empty array', () => {
    expect(getBusiestDay([])).toBeNull();
  });

  it('finds the day of week with most entries', () => {
    const dates = [
      new Date('2024-01-15T10:00:00Z'), // Monday (1)
      new Date('2024-01-15T14:00:00Z'), // Monday (1)
      new Date('2024-01-17T10:00:00Z'), // Wednesday (3)
    ];
    const result = getBusiestDay(dates);
    expect(result).toEqual({ dayIndex: 1, count: 2 });
  });
});

describe('dayOfWeekDate', () => {
  it('returns a date matching the given day of week', () => {
    const now = new Date('2024-01-17T12:00:00Z'); // Wednesday
    const result = dayOfWeekDate(1, now); // Monday
    expect(result.getDay()).toBe(1);
  });

  it('returns same day when dayIndex matches now', () => {
    const now = new Date('2024-01-17T12:00:00Z'); // Wednesday (3)
    const result = dayOfWeekDate(3, now);
    expect(result.getDay()).toBe(3);
  });
});

describe('maxPlaysInSingleDay', () => {
  it('returns 0 for empty array', () => {
    expect(maxPlaysInSingleDay([])).toBe(0);
  });

  it('finds the max plays on a single day', () => {
    const dates = [
      new Date('2024-01-15T10:00:00Z'),
      new Date('2024-01-15T14:00:00Z'),
      new Date('2024-01-15T18:00:00Z'),
      new Date('2024-01-16T10:00:00Z'),
    ];
    expect(maxPlaysInSingleDay(dates)).toBe(3);
  });
});

describe('computeDelta', () => {
  it('returns the difference between weeks', () => {
    expect(computeDelta(10, 7)).toBe(3);
    expect(computeDelta(5, 8)).toBe(-3);
    expect(computeDelta(5, 5)).toBe(0);
  });
});

describe('rankStats', () => {
  const stat = (key: string, value: number, delta: number | null, note?: string): PulseStat => ({
    key,
    value: String(value),
    label: key,
    delta,
    note,
  });

  it('drops totalPlays when all plays are episodes', () => {
    const candidates = [
      stat('totalPlays', 35, 9),
      stat('episodes', 35, 9),
      stat('shows', 18, -1),
    ];
    const rawCounts = new Map([['totalPlays', 35], ['episodes', 35], ['movies', 0]]);
    const result = rankStats(candidates, rawCounts);
    expect(result.map((r) => r.key)).not.toContain('totalPlays');
    expect(result.map((r) => r.key)).toContain('episodes');
  });

  it('drops totalPlays when all plays are movies', () => {
    const candidates = [
      stat('totalPlays', 10, 3),
      stat('movies', 10, 3),
      stat('episodes', 0, 0),
    ];
    const rawCounts = new Map([['totalPlays', 10], ['episodes', 0], ['movies', 10]]);
    const result = rankStats(candidates, rawCounts);
    expect(result.map((r) => r.key)).not.toContain('totalPlays');
    expect(result.map((r) => r.key)).toContain('movies');
  });

  it('drops zero movies with zero delta', () => {
    const candidates = [
      stat('totalPlays', 20, 5),
      stat('movies', 0, 0),
    ];
    const rawCounts = new Map([['totalPlays', 20], ['episodes', 20], ['movies', 0]]);
    const result = rankStats(candidates, rawCounts);
    expect(result.map((r) => r.key)).not.toContain('movies');
  });

  it('keeps movies when delta is non-zero even if value is 0', () => {
    const candidates = [
      stat('movies', 0, -3),
      stat('shows', 5, 2),
    ];
    const rawCounts = new Map([['totalPlays', 5], ['episodes', 5], ['movies', 0]]);
    const result = rankStats(candidates, rawCounts);
    expect(result.map((r) => r.key)).toContain('movies');
  });

  it('keeps all items when both episodes and movies have plays', () => {
    const candidates = [
      stat('totalPlays', 10, 2),
      stat('episodes', 7, 1),
      stat('movies', 3, 1),
    ];
    const rawCounts = new Map([['totalPlays', 10], ['episodes', 7], ['movies', 3]]);
    const result = rankStats(candidates, rawCounts);
    expect(result).toHaveLength(3);
  });

  it('ranks higher delta stats first', () => {
    const candidates = [
      stat('hours', 5, 1),
      stat('shows', 10, 8),
      stat('activeDays', 3, 0),
    ];
    const rawCounts = new Map([['totalPlays', 20], ['episodes', 20], ['movies', 0]]);
    const result = rankStats(candidates, rawCounts);
    expect(result[0]!.key).toBe('shows');
  });

  it('ranks stats with notes above zero-value zero-delta stats', () => {
    const candidates = [
      stat('busiestDay', 0, null, 'was Thu last week'),
      stat('movies', 0, 0),
    ];
    const rawCounts = new Map([['totalPlays', 5], ['episodes', 5], ['movies', 0]]);
    const result = rankStats(candidates, rawCounts);
    // movies gets filtered by redundancy rule, busiestDay survives
    expect(result[0]!.key).toBe('busiestDay');
  });
});
