import { describe, expect, it } from 'vitest';
import { sum } from './sum.ts';

describe('util: sum', () => {
  it('should total the values', () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
  });

  it('should return 0 for an empty array', () => {
    expect(sum([])).toBe(0);
  });

  it('should handle negative values', () => {
    expect(sum([10, -3, -2])).toBe(5);
  });

  it('should handle a single value', () => {
    expect(sum([7])).toBe(7);
  });
});
