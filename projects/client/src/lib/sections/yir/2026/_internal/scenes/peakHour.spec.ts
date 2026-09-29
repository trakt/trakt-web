import { describe, expect, it } from 'vitest';
import { peakHour } from './peakHour.ts';

describe('util: peakHour', () => {
  it('should return null without data', () => {
    expect(peakHour([])).toBeNull();
  });

  it('should return the busiest hour', () => {
    const hourly = Array.from(
      { length: 24 },
      (_, hour) => (hour === 22 ? 40 : 1),
    );

    expect(peakHour(hourly)).toBe(22);
  });

  it('should treat midnight as a valid peak', () => {
    expect(peakHour([9, 1, 1])).toBe(0);
  });
});
