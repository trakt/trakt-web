import { describe, expect, it } from 'vitest';
import { getStarFill } from './getStarFill.ts';

describe('getStarFill', () => {
  it('returns 0 if rating is undefined', () => {
    const star = { index: 1, value: 2, range: { min: 0, max: 2 } };
    expect(getStarFill(star)).toBe('none');
  });

  it('returns 100 up to the current rating', () => {
    const star2 = { index: 2, value: 4, range: { min: 2, max: 4 } };
    const star3 = { index: 3, value: 6, range: { min: 4, max: 6 } };
    const star4 = { index: 4, value: 8, range: { min: 6, max: 8 } };

    const rating = 6;
    expect(getStarFill(star2, rating)).toBe('full');
    expect(getStarFill(star3, rating)).toBe('full');
    expect(getStarFill(star4, rating)).toBe('none');
  });

  it('rounds to entire stars', () => {
    const star2 = { index: 2, value: 4, range: { min: 2, max: 4 } };
    const star3 = { index: 3, value: 6, range: { min: 4, max: 6 } };
    const star4 = { index: 4, value: 8, range: { min: 6, max: 8 } };

    const rating = 7;
    expect(getStarFill(star2, rating)).toBe('full');
    expect(getStarFill(star3, rating)).toBe('full');
    expect(getStarFill(star4, rating)).toBe('half');
  });
});
