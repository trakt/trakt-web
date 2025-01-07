import { describe, expect, it } from 'vitest';
import { random } from './random';

describe('random', () => {
  it('should generate number within range', () => {
    const min = 1;
    const max = 10;
    const result = random(min, max);

    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  it('should handle negative numbers', () => {
    const min = -10;
    const max = -1;
    const result = random(min, max);

    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  it('should handle zero range', () => {
    const min = 5;
    const max = 5;
    const result = random(min, max);

    expect(result).toBe(5);
  });

  it('should handle decimal numbers', () => {
    const min = 1.5;
    const max = 2.5;
    const result = random(min, max);

    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });
});
