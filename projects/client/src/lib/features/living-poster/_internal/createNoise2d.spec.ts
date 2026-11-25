import { describe, expect, it } from 'vitest';
import { createNoise2d } from './createNoise2d.ts';

const samples = Array.from({ length: 200 }, (_, index) => [
  index * 0.37 - 20,
  index * 0.61 - 40,
]);

describe('util: createNoise2d', () => {
  it('should repeat for the same seed', () => {
    const first = createNoise2d(7);
    const second = createNoise2d(7);

    for (const [x = 0, y = 0] of samples) {
      expect(first(x, y)).toBe(second(x, y));
    }
  });

  it('should stay within minus one and one', () => {
    const noise = createNoise2d(3);

    for (const [x = 0, y = 0] of samples) {
      expect(Math.abs(noise(x, y))).toBeLessThanOrEqual(1);
    }
  });

  it('should change smoothly between nearby points', () => {
    const noise = createNoise2d(5);

    for (const [x = 0, y = 0] of samples) {
      expect(Math.abs(noise(x + 0.01, y) - noise(x, y))).toBeLessThan(0.05);
      expect(Math.abs(noise(x, y + 0.01) - noise(x, y))).toBeLessThan(0.05);
    }
  });
});
