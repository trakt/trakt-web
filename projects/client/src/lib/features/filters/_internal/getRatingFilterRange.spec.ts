import type { StarRating } from '$lib/sections/summary/components/rating/models/StarRating.ts';
import { describe, expect, it } from 'vitest';
import { getRatingFilterRange } from './getRatingFilterRange.ts';

describe('getRatingFilterRange', () => {
  it('returns correct range for the first star', () => {
    const starRating: StarRating = {
      index: 1,
      value: 2,
      range: { min: 0, max: 2 },
    };
    expect(getRatingFilterRange(starRating)).toBe('0-20');
  });

  it('returns correct range for other stars', () => {
    const starRating: StarRating = {
      index: 3,
      value: 6,
      range: { min: 4, max: 6 },
    };
    expect(getRatingFilterRange(starRating)).toBe('41-60');
  });
});
