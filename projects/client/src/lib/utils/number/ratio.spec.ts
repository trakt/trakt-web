import { describe, expect, it } from 'vitest';
import { ratio } from './ratio.ts';

describe('util: ratio', () => {
  it('should divide value by total', () => {
    expect(ratio({ value: 1, total: 4 })).toBe(0.25);
  });

  it('should return 0 when total is 0', () => {
    expect(ratio({ value: 5, total: 0 })).toBe(0);
  });

  it('should never emit Infinity or NaN', () => {
    expect(Number.isFinite(ratio({ value: 5, total: 0 }))).toBe(true);
    expect(Number.isNaN(ratio({ value: 0, total: 0 }))).toBe(false);
  });

  it('should support ratios above 1', () => {
    expect(ratio({ value: 8, total: 4 })).toBe(2);
  });
});
