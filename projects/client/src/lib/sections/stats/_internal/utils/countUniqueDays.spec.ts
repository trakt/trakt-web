import { describe, expect, it } from 'vitest';
import { countUniqueDays } from './countUniqueDays.ts';

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
