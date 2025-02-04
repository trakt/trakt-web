import { describe, expect, it } from 'vitest';
import { toVotesBasedRating } from './toVotesBasedRating.ts';

describe('toVotesBasedRating', () => {
  it('should return "unrated" when votes is 0', () => {
    expect(toVotesBasedRating(0)).toBe('unrated');
  });

  it('should return "rated" when votes is greater than 0', () => {
    expect(toVotesBasedRating(1)).toBe('rated');
    expect(toVotesBasedRating(100)).toBe('rated');
  });

  it('should return "rated" when votes is negative', () => {
    expect(toVotesBasedRating(-1)).toBe('rated');
  });
});
