import { describe, expect, it } from 'vitest';
import { emberColor } from './emberColor.ts';

describe('util: emberColor', () => {
  it('should be near white at full heat and dark red when cold', () => {
    expect(emberColor(1)).toEqual([255, 250, 220]);
    expect(emberColor(0)).toEqual([120, 20, 10]);
  });

  it('should blend between the two nearest stops', () => {
    const [red, green, blue] = emberColor(0.625);

    expect(red).toBeCloseTo(255);
    expect(green).toBeCloseTo(175);
    expect(blue).toBeCloseTo(85);
  });

  it('should clamp heat outside the ramp', () => {
    expect(emberColor(1.4)).toEqual(emberColor(1));
    expect(emberColor(-0.5)).toEqual(emberColor(0));
  });
});
