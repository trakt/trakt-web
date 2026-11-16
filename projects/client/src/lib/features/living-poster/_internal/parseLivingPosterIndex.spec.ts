import { describe, expect, it } from 'vitest';
import { hasLivingPoster } from './hasLivingPoster.ts';
import { parseLivingPosterIndex } from './parseLivingPosterIndex.ts';

describe('util: parseLivingPosterIndex', () => {
  it('should split movie and show ids', () => {
    const index = parseLivingPosterIndex({ v: 1, movies: [1, 2], shows: [3] });

    expect(index?.movies).toEqual(new Set([1, 2]));
    expect(index?.shows).toEqual(new Set([3]));
  });

  it('should treat missing lists as empty', () => {
    expect(parseLivingPosterIndex({ v: 1 })).toEqual({
      movies: new Set(),
      shows: new Set(),
    });
  });

  it('should reject unknown versions and garbage', () => {
    expect(parseLivingPosterIndex({ v: 2, movies: [1] })).toBeNull();
    expect(parseLivingPosterIndex({ v: 1, movies: ['1'] })).toBeNull();
    expect(parseLivingPosterIndex(null)).toBeNull();
  });
});

describe('util: hasLivingPoster', () => {
  const index = { movies: new Set([10]), shows: new Set([20]) };

  it('should find movies and shows in their own list', () => {
    expect(hasLivingPoster({ index, target: { type: 'movie', id: 10 } })).toBe(
      true,
    );
    expect(hasLivingPoster({ index, target: { type: 'show', id: 20 } })).toBe(
      true,
    );
  });

  it('should not mix up ids across media types', () => {
    expect(hasLivingPoster({ index, target: { type: 'show', id: 10 } })).toBe(
      false,
    );
    expect(hasLivingPoster({ index, target: { type: 'movie', id: 20 } })).toBe(
      false,
    );
  });

  it('should be false for unlisted ids', () => {
    expect(hasLivingPoster({ index, target: { type: 'movie', id: 99 } })).toBe(
      false,
    );
  });
});
