import { describe, expect, it } from 'vitest';
import { computeStreak } from './useStreak.ts';

describe('computeStreak', () => {
  it('returns none for empty dates', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    expect(computeStreak([], now)).toEqual({ count: 0 });
  });

  it('returns active streak when watched today', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-15T10:00:00Z'),
      new Date('2024-01-14T10:00:00Z'),
      new Date('2024-01-13T10:00:00Z'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 3 });
  });

  it('returns at_risk when last watch was yesterday', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-14T10:00:00Z'),
      new Date('2024-01-13T10:00:00Z'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 2 });
  });

  it('returns none when gap is more than one day', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-12T10:00:00Z'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 0 });
  });

  it('breaks streak at gap', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-15T10:00:00Z'),
      new Date('2024-01-14T10:00:00Z'),
      // gap on Jan 13
      new Date('2024-01-12T10:00:00Z'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 2 });
  });

  it('counts single day as streak of 1', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [new Date('2024-01-15T10:00:00Z')];
    expect(computeStreak(dates, now)).toEqual({ count: 1 });
  });

  it('handles multiple watches on the same day', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-15T08:00:00Z'),
      new Date('2024-01-15T12:00:00Z'),
      new Date('2024-01-15T20:00:00Z'),
      new Date('2024-01-14T10:00:00Z'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 2 });
  });

  it('attributes a buffer-window watch only to the previous day', () => {
    // A watch at 00:25 on Jan 15 is attributed to Jan 14 only — Jan 15 gets no credit.
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-15T00:25:00Z'), // 25 min past midnight → counts for Jan 14 only
      new Date('2024-01-14T10:00:00Z'),
    ];
    // Only Jan 14 has activity; streak = 1 (ending yesterday)
    expect(computeStreak(dates, now)).toEqual({ count: 1 });
  });

  it('breaks a streak when a day has only an early-morning watch', () => {
    // Jan 13 has only a 00:15 watch — attributed to Jan 12, leaving Jan 13 empty.
    // The streak from Jan 15 back stops at Jan 13.
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-15T10:00:00Z'), // normal watch
      new Date('2024-01-14T10:00:00Z'), // normal watch
      new Date('2024-01-13T00:15:00Z'), // only watch on Jan 13 — attributed to Jan 12
      new Date('2024-01-12T10:00:00Z'), // normal watch
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 2 });
  });

  it('does not apply buffer to watches at exactly 30 minutes past midnight', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-15T00:30:00Z'), // exactly at the buffer boundary → stays Jan 15
      new Date('2024-01-14T10:00:00Z'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 2 });
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
    expect(computeStreak(dates, now)).toEqual({ count: 2 });
  });

  it('correctly sorts days when single-digit and double-digit values coexist', () => {
    // getDayKey returns unpadded strings like "2026-3-19".
    // String sort places "2026-3-19" before "2026-3-3" ("1" < "3" at pos 7),
    // which breaks streak detection — the sort must be numeric, not lexicographic.
    // Dates use T10:00:00Z (daytime) to avoid triggering the midnight buffer.
    const now = new Date('2026-03-30T12:00:00Z');
    const dates = [
      // Continuous streak: March 22–30 (9 days)
      new Date('2026-03-30T10:00:00Z'),
      new Date('2026-03-29T10:00:00Z'),
      new Date('2026-03-28T10:00:00Z'),
      new Date('2026-03-27T10:00:00Z'),
      new Date('2026-03-26T10:00:00Z'),
      new Date('2026-03-25T10:00:00Z'),
      new Date('2026-03-24T10:00:00Z'),
      new Date('2026-03-23T10:00:00Z'),
      new Date('2026-03-22T10:00:00Z'),
      // Gap on March 21
      new Date('2026-03-20T10:00:00Z'),
      new Date('2026-03-19T10:00:00Z'),
      new Date('2026-03-18T10:00:00Z'),
      new Date('2026-03-16T10:00:00Z'),
      // Older entries that trigger the string-sort bug (single-digit day "3")
      new Date('2026-03-03T10:00:00Z'),
    ];
    expect(computeStreak(dates, now)).toEqual({ count: 9 });
  });
});
