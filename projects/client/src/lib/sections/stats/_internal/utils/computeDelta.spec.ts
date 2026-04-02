import { describe, expect, it } from 'vitest';
import { computeDelta } from './computeDelta.ts';

describe('computeDelta', () => {
  it('returns the difference between weeks', () => {
    expect(computeDelta(10, 7)).toBe(3);
    expect(computeDelta(5, 8)).toBe(-3);
    expect(computeDelta(5, 5)).toBe(0);
  });
});
