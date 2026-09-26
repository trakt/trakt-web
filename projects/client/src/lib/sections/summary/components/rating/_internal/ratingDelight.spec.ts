import { describe, expect, it } from 'vitest';
import { ratingDelight } from './ratingDelight.ts';

describe('util: ratingDelight', () => {
  it('should throw popcorn for a perfect 10', () => {
    expect(ratingDelight(10)).toBe('popcorn');
  });

  it('should throw a rotten tomato for one star or less', () => {
    expect(ratingDelight(1)).toBe('rotten-tomato');
    expect(ratingDelight(2)).toBe('rotten-tomato');
  });

  it('should stay quiet for everything in between', () => {
    [3, 5, 7, 9].forEach((rating) => expect(ratingDelight(rating)).toBeNull());
  });

  it('should stay quiet when the rating is cleared', () => {
    expect(ratingDelight(0)).toBeNull();
  });
});
