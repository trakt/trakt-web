import { describe, expect, it } from 'vitest';
import { toWholeYearsSince } from './toWholeYearsSince.ts';

describe('util: toWholeYearsSince', () => {
  const now = new Date('2026-07-30T00:00:00.000Z').getTime();

  it('should count the exact anniversary as a whole year', () => {
    expect(toWholeYearsSince(new Date('2025-07-30T00:00:00.000Z'), now)).toBe(
      1,
    );
    expect(toWholeYearsSince(new Date('2016-07-30T00:00:00.000Z'), now)).toBe(
      10,
    );
  });

  it('should floor before the anniversary has passed', () => {
    // Joined Aug 2025 -> not yet a year by Jul 2026.
    expect(toWholeYearsSince(new Date('2025-08-01T00:00:00.000Z'), now)).toBe(
      0,
    );
  });

  it('should return 0 for missing, future, or invalid dates', () => {
    expect(toWholeYearsSince(null, now)).toBe(0);
    expect(toWholeYearsSince(undefined, now)).toBe(0);
    expect(toWholeYearsSince(new Date(now + 1_000_000), now)).toBe(0);
    expect(toWholeYearsSince(new Date('nope'), now)).toBe(0);
  });
});
