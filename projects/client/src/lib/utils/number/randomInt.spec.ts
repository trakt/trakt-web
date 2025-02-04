import { describe, expect, it } from 'vitest';
import { randomInt } from './randomInt.ts';

describe('randomInt', () => {
  it('should generate integer numbers within the specified range', () => {
    const min = 1;
    const max = 10;
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      const result = randomInt(min, max);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThan(max);
    }
  });

  it('should work with negative numbers', () => {
    const min = -10;
    const max = -1;
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      const result = randomInt(min, max);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThan(max);
    }
  });
});
