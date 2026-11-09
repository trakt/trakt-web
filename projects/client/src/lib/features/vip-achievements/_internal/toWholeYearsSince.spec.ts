import { describe, expect, it } from 'vitest';
import { toWholeYearsSince } from './toWholeYearsSince.ts';

const joined = new Date('2019-06-15T00:00:00Z');

describe('util: toWholeYearsSince', () => {
  it('should count up only on the anniversary', () => {
    expect(toWholeYearsSince(joined, Date.parse('2026-06-14T23:00:00Z'))).toBe(
      6,
    );
    expect(toWholeYearsSince(joined, Date.parse('2026-06-15T00:00:00Z'))).toBe(
      7,
    );
  });

  it('should be 0 without a join date or before a full year', () => {
    expect(toWholeYearsSince(null, Date.now())).toBe(0);
    expect(toWholeYearsSince(joined, Date.parse('2020-01-01T00:00:00Z'))).toBe(
      0,
    );
  });
});
