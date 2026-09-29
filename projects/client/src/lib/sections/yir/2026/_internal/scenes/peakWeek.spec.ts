import { describe, expect, it } from 'vitest';
import { peakWeek } from './peakWeek.ts';

describe('util: peakWeek', () => {
  it('should return null without data', () => {
    expect(peakWeek([], 2026)).toBeNull();
  });

  it('should find the busiest week and its range', () => {
    const peak = peakWeek([3, 9, 4], 2026);

    expect(peak?.plays).toBe(9);
    expect(peak?.start.getDate()).toBe(8);
    expect(peak?.end.getDate()).toBe(14);
  });

  it('should pick the first week on a tie', () => {
    expect(peakWeek([5, 5], 2026)?.start.getDate()).toBe(1);
  });
});
