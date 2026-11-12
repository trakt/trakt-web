import { describe, expect, it } from 'vitest';
import { toPeakLabels } from './toPeakLabels.ts';

describe('util: toPeakLabels', () => {
  it('should point at the busiest day and hour', () => {
    const peaks = toPeakLabels({
      dailyPlays: [1, 4, 2],
      hourlyPlays: [0, 0, 5, 1],
      year: 2026,
      month: 10,
      locale: 'en',
    });

    expect(peaks.dayIndex).toBe(1);
    expect(peaks.hourIndex).toBe(2);
    expect(peaks.day).toMatch(/Fri/);
    expect(peaks.day).toMatch(/\b2\b/);
    expect(peaks.hour).toMatch(/2/);
  });

  it('should have no peak for an empty month', () => {
    const peaks = toPeakLabels({
      dailyPlays: [0, 0],
      year: 2026,
      month: 10,
      locale: 'en',
    });

    expect(peaks.day).toBeUndefined();
    expect(peaks.hour).toBeUndefined();
  });
});
