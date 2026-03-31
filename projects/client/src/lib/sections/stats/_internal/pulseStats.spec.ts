import { describe, expect, it } from 'vitest';
import {
  computeDelta,
  countUniqueDays,
  dayOfWeekDate,
  getBusiestDay,
  maxPlaysInSingleDay,
  type PulseStat,
  rankStats,
} from './pulseStats.ts';

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
    const now = new Date('2024-01-17T12:00:00Z');
    const result = dayOfWeekDate(1, now);
    expect(result.getDay()).toBe(1);
  });

  it('returns same day when dayIndex matches now', () => {
    const now = new Date('2024-01-17T12:00:00Z');
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
  const stat = (
    key: string,
    value: number,
    delta: number | null,
    note?: string,
  ): PulseStat => ({
    key,
    rawValue: value,
    value: String(value),
    label: key,
    delta,
    note,
  });

  const emptyCounts = new Map<string, number>([
    ['totalPlays', 0],
    ['episodes', 0],
    ['movies', 0],
  ]);

  it('ranks higher delta stats first', () => {
    const candidates = [
      stat('hours', 5, 1),
      stat('shows', 10, 8),
      stat('activeDays', 3, 0),
    ];
    const result = rankStats(candidates, emptyCounts);
    expect(result[0]!.key).toBe('shows');
  });

  it('ranks stats with notes above zero-value zero-delta stats', () => {
    const candidates = [
      stat('busiestDay', 0, null, 'was Thu last week'),
      stat('movies', 0, 0),
    ];
    const result = rankStats(candidates, emptyCounts);
    expect(result[0]!.key).toBe('busiestDay');
  });

  it('keeps all candidates but deprioritizes redundant ones', () => {
    const candidates = [
      stat('totalPlays', 35, 9),
      stat('episodes', 35, 9),
      stat('movies', 0, 0),
    ];
    const rawCounts = new Map([['totalPlays', 35], ['episodes', 35], [
      'movies',
      0,
    ]]);
    const result = rankStats(candidates, rawCounts);
    expect(result).toHaveLength(3);
    // episodes is not redundant, should be first
    expect(result[0]!.key).toBe('episodes');
    // totalPlays and movies are both redundant — totalPlays has higher base score
    expect(result[1]!.key).toBe('totalPlays');
    expect(result[2]!.key).toBe('movies');
  });

  it('deprioritizes zero-value zero-delta stats', () => {
    const candidates = [
      stat('shows', 5, 2),
      stat('movies', 0, 0),
    ];
    const rawCounts = new Map([['totalPlays', 5], ['episodes', 5], [
      'movies',
      0,
    ]]);
    const result = rankStats(candidates, rawCounts);
    expect(result[0]!.key).toBe('shows');
    expect(result[1]!.key).toBe('movies');
  });
});
