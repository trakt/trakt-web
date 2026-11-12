import { describe, expect, it } from 'vitest';
import { isPastMonth } from './isPastMonth.ts';

describe('util: isPastMonth', () => {
  const now = new Date(2026, 10, 5);

  it('should accept an earlier month', () => {
    expect(isPastMonth({ year: 2026, month: 10, now })).toBe(true);
    expect(isPastMonth({ year: 2025, month: 12, now })).toBe(true);
  });

  it('should reject the current and future months', () => {
    expect(isPastMonth({ year: 2026, month: 11, now })).toBe(false);
    expect(isPastMonth({ year: 2026, month: 12, now })).toBe(false);
    expect(isPastMonth({ year: 2027, month: 1, now })).toBe(false);
  });
});
