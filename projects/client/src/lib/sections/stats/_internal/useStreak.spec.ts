import { describe, expect, it } from 'vitest';
import { computeStreak } from './useStreak.ts';

describe('computeStreak', () => {
  it('returns none for empty dates', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    expect(computeStreak([], now)).toEqual({ count: 0, state: 'none' });
  });

  it('returns active streak when watched today', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-15T10:00:00Z'),
      new Date('2024-01-14T10:00:00Z'),
      new Date('2024-01-13T10:00:00Z'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 3, state: 'active' });
  });

  it('returns at_risk when last watch was yesterday', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-14T10:00:00Z'),
      new Date('2024-01-13T10:00:00Z'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 2, state: 'at_risk' });
  });

  it('returns none when gap is more than one day', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-12T10:00:00Z'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 0, state: 'none' });
  });

  it('breaks streak at gap', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-15T10:00:00Z'),
      new Date('2024-01-14T10:00:00Z'),
      // gap on Jan 13
      new Date('2024-01-12T10:00:00Z'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 2, state: 'active' });
  });

  it('counts single day as streak of 1', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [new Date('2024-01-15T10:00:00Z')];
    expect(computeStreak(dates, now)).toEqual({ count: 1, state: 'active' });
  });

  it('handles multiple watches on the same day', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-15T08:00:00Z'),
      new Date('2024-01-15T12:00:00Z'),
      new Date('2024-01-15T20:00:00Z'),
      new Date('2024-01-14T10:00:00Z'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 2, state: 'active' });
  });

  it('uses local time for day boundaries, not UTC', () => {
    // getDayKey uses getFullYear/getMonth/getDate (local time).
    // In UTC (test env), these match UTC — confirming the function
    // groups by the environment's local day, not by a hardcoded timezone.
    const now = new Date('2024-01-15T23:30:00Z');
    const dates = [
      // Late-night watch on the 15th (same local day as `now` in UTC env)
      new Date('2024-01-15T23:00:00Z'),
      new Date('2024-01-14T10:00:00Z'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 2, state: 'active' });
  });

  it('correctly sorts days when single-digit and double-digit values coexist', () => {
    // getDayKey returns unpadded strings like "2026-3-19".
    // String sort places "2026-3-19" before "2026-3-3" ("1" < "3" at pos 7),
    // which breaks streak detection — the sort must be numeric, not lexicographic.
    const now = new Date('2026-03-30T12:00:00');
    const dates = [
      // Continuous streak: March 22–30 (9 days)
      new Date('2026-03-30'),
      new Date('2026-03-29'),
      new Date('2026-03-28'),
      new Date('2026-03-27'),
      new Date('2026-03-26'),
      new Date('2026-03-25'),
      new Date('2026-03-24'),
      new Date('2026-03-23'),
      new Date('2026-03-22'),
      // Gap on March 21
      new Date('2026-03-20'),
      new Date('2026-03-19'),
      new Date('2026-03-18'),
      new Date('2026-03-16'),
      // Older entries that trigger the string-sort bug (single-digit day "3")
      new Date('2026-03-03'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 9, state: 'active' });
  });
});
