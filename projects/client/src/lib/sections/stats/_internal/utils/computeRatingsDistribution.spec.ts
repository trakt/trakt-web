import { describe, expect, it } from 'vitest';
import { computeRatingsDistribution } from './computeRatingsDistribution.ts';

describe('computeRatingsDistribution', () => {
  it('buckets scores correctly (index 0 = score 1)', () => {
    const result = computeRatingsDistribution([1, 1, 5, 10]);
    expect(result.buckets[0]).toBe(2); // score 1
    expect(result.buckets[4]).toBe(1); // score 5
    expect(result.buckets[9]).toBe(1); // score 10
  });

  it('computes average correctly', () => {
    const result = computeRatingsDistribution([6, 8, 10]);
    expect(result.average).toBe(8);
  });

  it('handles empty input', () => {
    const result = computeRatingsDistribution([]);
    expect(result.buckets.every((b) => b === 0)).toBe(true);
    expect(result.average).toBe(0);
  });
});
