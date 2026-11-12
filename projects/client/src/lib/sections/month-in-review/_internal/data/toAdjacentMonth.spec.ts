import { describe, expect, it } from 'vitest';
import { toAdjacentMonth } from './toAdjacentMonth.ts';

describe('util: toAdjacentMonth', () => {
  it('should move within the same year', () => {
    expect(toAdjacentMonth({ year: 2026, month: 10, offset: 1 })).toEqual({
      year: 2026,
      month: 11,
    });
  });

  it('should roll back into the previous year', () => {
    expect(toAdjacentMonth({ year: 2026, month: 1, offset: -1 })).toEqual({
      year: 2025,
      month: 12,
    });
  });

  it('should roll over into the next year', () => {
    expect(toAdjacentMonth({ year: 2026, month: 12, offset: 1 })).toEqual({
      year: 2027,
      month: 1,
    });
  });
});
