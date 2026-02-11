import { describe, expect, it } from 'vitest';
import { toUserRating } from './toUserRating.ts';

describe('toUserRating', () => {
  it('will format ratings to star values', () => {
    expect(toUserRating(0)).toBe('0');
    expect(toUserRating(0.25)).toBe('1.3');
    expect(toUserRating(0.5)).toBe('2.5');
    expect(toUserRating(0.55)).toBe('2.8');
    expect(toUserRating(0.8)).toBe('4');
    expect(toUserRating(1)).toBe('5');
  });
});
