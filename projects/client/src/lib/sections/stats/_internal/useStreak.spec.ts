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
});
