import { describe, expect, it } from 'vitest';
import { isFullRange } from './isFullRange.ts';

const range = { min: 0, max: 100 };

describe('util: isFullRange', () => {
  it('should be true when the value spans the whole range', () => {
    expect(isFullRange({ value: { min: 0, max: 100 }, range })).toBe(true);
  });

  it('should be false when the lower bound is raised', () => {
    expect(isFullRange({ value: { min: 10, max: 100 }, range })).toBe(false);
  });

  it('should be false when the upper bound is lowered', () => {
    expect(isFullRange({ value: { min: 0, max: 90 }, range })).toBe(false);
  });
});
