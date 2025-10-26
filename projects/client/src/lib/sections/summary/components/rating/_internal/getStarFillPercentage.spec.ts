import { describe, expect, it } from 'vitest';
import { getStarFillPercentage } from './getStarFillPercentage.ts';

describe('getStarFillPercentage', () => {
  it('returns 0 if rating is undefined', () => {
    const star = { index: 1, value: 2, range: { min: 0, max: 2 } };
    expect(getStarFillPercentage(star)).toBe(0);
  });

  it('returns 100 up to the current rating', () => {
    const star2 = { index: 2, value: 4, range: { min: 2, max: 4 } };
    const star3 = { index: 3, value: 6, range: { min: 4, max: 6 } };
    const star4 = { index: 4, value: 8, range: { min: 6, max: 8 } };

    const rating = 6;
    expect(getStarFillPercentage(star2, rating)).toBe(100);
    expect(getStarFillPercentage(star3, rating)).toBe(100);
    expect(getStarFillPercentage(star4, rating)).toBe(0);
  });

  it('rounds to entire stars', () => {
    const star2 = { index: 2, value: 4, range: { min: 2, max: 4 } };
    const star3 = { index: 3, value: 6, range: { min: 4, max: 6 } };
    const star4 = { index: 4, value: 8, range: { min: 6, max: 8 } };

    const rating = 7.5;
    expect(getStarFillPercentage(star2, rating)).toBe(100);
    expect(getStarFillPercentage(star3, rating)).toBe(100);
    expect(getStarFillPercentage(star4, rating)).toBe(100);
  });
});
