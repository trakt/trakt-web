import { describe, expect, it } from 'vitest';
import { radarPoint } from './radarPoint.ts';

describe('util: radarPoint', () => {
  it('should put the first axis straight up', () => {
    const { x, y } = radarPoint({ radius: 40, index: 0, count: 10 });

    expect(x).toBeCloseTo(50);
    expect(y).toBeCloseTo(10);
  });

  it('should go clockwise', () => {
    const { x, y } = radarPoint({ radius: 40, index: 1, count: 4 });

    expect(x).toBeCloseTo(90);
    expect(y).toBeCloseTo(50);
  });

  it('should collapse to the centre at radius 0', () => {
    expect(radarPoint({ radius: 0, index: 3, count: 10 })).toEqual({
      x: 50,
      y: 50,
    });
  });
});
