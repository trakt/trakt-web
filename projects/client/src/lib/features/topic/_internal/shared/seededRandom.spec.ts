import { describe, expect, it } from 'vitest';
import { seededRandom } from './seededRandom.ts';

const sample = (seed: number, count: number) => {
  const random = seededRandom(seed);
  return Array.from({ length: count }, () => random());
};

describe('util: seededRandom', () => {
  it('should repeat the same sequence for the same seed', () => {
    expect(sample(1218, 8)).toEqual(sample(1218, 8));
  });

  it('should produce different sequences for different seeds', () => {
    expect(sample(1218, 8)).not.toEqual(sample(1812, 8));
  });

  it('should stay within the half open range from 0 to 1', () => {
    const values = sample(77, 500);

    expect(values.every((value) => value >= 0 && value < 1)).toBe(true);
  });

  it('should treat the seed as an unsigned 32 bit integer', () => {
    expect(sample(-1, 4)).toEqual(sample(0xffffffff, 4));
  });
});
