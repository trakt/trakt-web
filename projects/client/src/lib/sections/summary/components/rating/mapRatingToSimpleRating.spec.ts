import { describe, expect, it } from 'vitest';
import { mapRatingToSimpleRating } from './mapRatingToSimpleRating.ts';

describe('mapRatingToSimpleRating', () => {
  it('should return bad', () => {
    expect(mapRatingToSimpleRating(1)).toBe('bad');
    expect(mapRatingToSimpleRating(2)).toBe('bad');
    expect(mapRatingToSimpleRating(3)).toBe('bad');
    expect(mapRatingToSimpleRating(4)).toBe('bad');
    expect(mapRatingToSimpleRating(5)).toBe('bad');
    expect(mapRatingToSimpleRating(6)).toBe('bad');
  });

  it('should return good', () => {
    expect(mapRatingToSimpleRating(7)).toBe('good');
    expect(mapRatingToSimpleRating(8)).toBe('good');
    expect(mapRatingToSimpleRating(9)).toBe('good');
  });

  it('should return great', () => {
    expect(mapRatingToSimpleRating(10)).toBe('great');
  });
});
