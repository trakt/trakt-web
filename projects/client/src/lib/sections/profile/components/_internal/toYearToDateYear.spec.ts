import { describe, expect, it } from 'vitest';
import { toYearToDateYear } from './toYearToDateYear.ts';

describe('util: toYearToDateYear', () => {
  it('should return the previous year in January', () => {
    expect(toYearToDateYear(new Date(2026, 0, 15))).toBe(2025);
  });

  it('should return the current year in February', () => {
    expect(toYearToDateYear(new Date(2026, 1, 1))).toBe(2026);
  });

  it('should return the current year in December', () => {
    expect(toYearToDateYear(new Date(2026, 11, 31))).toBe(2026);
  });
});
