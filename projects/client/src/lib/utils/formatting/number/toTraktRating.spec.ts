import { describe, expect, it } from 'vitest';
import { toTraktRating } from './toTraktRating.ts';

describe('toTraktRating', () => {
  it('will format ratings to star values', () => {
    expect(toTraktRating(0)).toBe('0');
    expect(toTraktRating(0.25)).toBe('1.3');
    expect(toTraktRating(0.5)).toBe('2.5');
    expect(toTraktRating(0.55)).toBe('2.8');
    expect(toTraktRating(0.8)).toBe('4');
    expect(toTraktRating(1)).toBe('5');
  });
});
