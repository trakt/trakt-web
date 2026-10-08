import { describe, expect, it } from 'vitest';
import { toTilt } from './toTilt.ts';

const box = { left: 100, top: 50, width: 200, height: 100 };
const max = { x: 14, y: 10 };

describe('util: toTilt', () => {
  it('should tilt fully toward the top start corner', () => {
    expect(toTilt({ point: { x: 100, y: 50 }, box, max })).toEqual({
      x: -14,
      y: 10,
    });
  });

  it('should tilt fully toward the bottom end corner', () => {
    expect(toTilt({ point: { x: 300, y: 150 }, box, max })).toEqual({
      x: 14,
      y: -10,
    });
  });

  it('should tilt halfway between the center and an edge', () => {
    expect(toTilt({ point: { x: 250, y: 75 }, box, max })).toEqual({
      x: 7,
      y: 5,
    });
  });
});
