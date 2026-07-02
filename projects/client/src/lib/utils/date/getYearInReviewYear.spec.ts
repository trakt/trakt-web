import { describe, expect, it } from 'vitest';
import { getYearInReviewYear } from './getYearInReviewYear.ts';

describe('getYearInReviewYear', () => {
  it('returns the previous year in January', () => {
    const date = new Date(2025, 0, 15);
    expect(getYearInReviewYear(date)).toBe(2024);
  });

  it('returns the previous year in February', () => {
    const date = new Date(2025, 1, 28);
    expect(getYearInReviewYear(date)).toBe(2024);
  });

  it('returns the current year in March', () => {
    const date = new Date(2025, 2, 1);
    expect(getYearInReviewYear(date)).toBe(2025);
  });

  it('returns the current year for a mid-year date', () => {
    const date = new Date(2025, 5, 15);
    expect(getYearInReviewYear(date)).toBe(2025);
  });

  it('returns the current year in December', () => {
    const date = new Date(2025, 11, 31);
    expect(getYearInReviewYear(date)).toBe(2025);
  });
});
