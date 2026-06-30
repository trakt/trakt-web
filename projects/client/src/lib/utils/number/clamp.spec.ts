import { describe, expect, it } from 'vitest';
import { clamp } from './clamp.ts';

describe('util: clamp', () => {
  it('should return the value when inside the range', () => {
    expect(clamp({ value: 5, min: 0, max: 10 })).toBe(5);
  });

  it('should pin to the lower bound when below', () => {
    expect(clamp({ value: -3, min: 0, max: 10 })).toBe(0);
  });

  it('should pin to the upper bound when above', () => {
    expect(clamp({ value: 42, min: 0, max: 10 })).toBe(10);
  });

  it('should return the bound when value equals it', () => {
    expect(clamp({ value: 0, min: 0, max: 10 })).toBe(0);
    expect(clamp({ value: 10, min: 0, max: 10 })).toBe(10);
  });

  it('should tolerate an inverted range', () => {
    expect(clamp({ value: 5, min: 10, max: 0 })).toBe(5);
    expect(clamp({ value: 20, min: 10, max: 0 })).toBe(10);
  });
});
