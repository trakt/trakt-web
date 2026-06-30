import { describe, expect, it } from 'vitest';
import { resampleSeries } from './resampleSeries.ts';

describe('util: resampleSeries', () => {
  it('should produce exactly targetLength points', () => {
    const result = resampleSeries({ values: [0, 5, 2, 8], targetLength: 20 });
    expect(result).toHaveLength(20);
  });

  it('should preserve the endpoints', () => {
    const result = resampleSeries({ values: [3, 9, 1, 7], targetLength: 16 });
    expect(result.at(0)).toBeCloseTo(3);
    expect(result.at(-1)).toBeCloseTo(7);
  });

  it('should pass through the original samples at matching positions', () => {
    const values = [0, 10, 4, 6, 2];
    const result = resampleSeries({ values, targetLength: values.length });
    values.forEach((value, index) => expect(result[index]).toBeCloseTo(value));
  });

  it('should stay exact for linear data (no overshoot)', () => {
    const result = resampleSeries({ values: [0, 2, 4, 6], targetLength: 7 });
    [0, 1, 2, 3, 4, 5, 6].forEach((expected, index) =>
      expect(result[index]).toBeCloseTo(expected)
    );
  });

  it('should keep a monotone-increasing series monotone', () => {
    const result = resampleSeries({
      values: [0, 1, 3, 7, 12],
      targetLength: 50,
    });
    result.forEach((value, index) => {
      if (index === 0) return;
      expect(value).toBeGreaterThanOrEqual(result[index - 1]);
    });
  });

  it('should not overshoot a flat-then-rise step', () => {
    const result = resampleSeries({
      values: [0, 0, 0, 10],
      targetLength: 40,
    });
    const max = Math.max(...result);
    const min = Math.min(...result);
    expect(max).toBeLessThanOrEqual(10 + 1e-9);
    expect(min).toBeGreaterThanOrEqual(0 - 1e-9);
  });

  it('should hold a constant series flat', () => {
    const result = resampleSeries({ values: [4, 4, 4], targetLength: 9 });
    result.forEach((value) => expect(value).toBeCloseTo(4));
  });

  it('should fill from a single value', () => {
    expect(resampleSeries({ values: [5], targetLength: 4 })).toEqual([
      5,
      5,
      5,
      5,
    ]);
  });

  it('should return an empty array for empty input', () => {
    expect(resampleSeries({ values: [], targetLength: 10 })).toEqual([]);
  });

  it('should return an empty array for a non-positive target length', () => {
    expect(resampleSeries({ values: [1, 2, 3], targetLength: 0 })).toEqual([]);
  });

  it('should collapse to the first value for a target length of 1', () => {
    expect(resampleSeries({ values: [1, 2, 3], targetLength: 1 })).toEqual([1]);
  });
});
