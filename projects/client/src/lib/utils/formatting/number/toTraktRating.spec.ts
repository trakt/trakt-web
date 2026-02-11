import { describe, expect, it } from 'vitest';
import { toTraktRating } from './toTraktRating.ts';

describe('toTraktRating', () => {
  it('will format ratings to percentages', () => {
    expect(toTraktRating(0.45)).toBe('45%');
    expect(toTraktRating(0.99)).toBe('99%');
    expect(toTraktRating(1)).toBe('100%');
  });
});
