import { describe, expect, it } from 'vitest';
import { nearestIndex } from './nearestIndex.ts';

describe('util: nearestIndex', () => {
  const positions = [0, 10, 20, 30];

  it('should find the closest position', () => {
    expect(nearestIndex({ positions, target: 12 })).toBe(1);
    expect(nearestIndex({ positions, target: 26 })).toBe(3);
  });

  it('should clamp to the ends', () => {
    expect(nearestIndex({ positions, target: -5 })).toBe(0);
    expect(nearestIndex({ positions, target: 999 })).toBe(3);
  });

  it('should pick the lower index on a tie', () => {
    expect(nearestIndex({ positions, target: 15 })).toBe(1);
  });

  it('should return -1 for an empty set', () => {
    expect(nearestIndex({ positions: [], target: 5 })).toBe(-1);
  });
});
