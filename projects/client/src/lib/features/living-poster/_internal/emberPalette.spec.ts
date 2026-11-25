import { describe, expect, it } from 'vitest';
import { emberPalette } from './emberPalette.ts';

const brightness = ([red, green, blue]: readonly number[]) =>
  (red ?? 0) + (green ?? 0) + (blue ?? 0);

describe('util: emberPalette', () => {
  it('should cool warm embers from near white to a dim deep red', () => {
    const palette = emberPalette(null);
    const [hotRed, hotGreen, hotBlue] = palette(1);
    const [coldRed, coldGreen, coldBlue] = palette(0);

    expect(hotRed).toBe(255);
    expect(hotGreen).toBeGreaterThan(190);
    expect(hotBlue).toBeGreaterThan(130);
    expect(coldRed).toBeGreaterThan(coldGreen);
    expect(coldGreen).toBeGreaterThanOrEqual(coldBlue);
    expect(brightness(palette(0))).toBeLessThan(brightness(palette(0.5)));
  });

  it('should keep the hue of a cool authored colour', () => {
    const palette = emberPalette('#3080ff');
    const [red, green, blue] = palette(0.6);

    expect(blue).toBeGreaterThan(green);
    expect(green).toBeGreaterThan(red);
    expect(blue / green).toBeCloseTo(255 / 128, 1);
    expect(palette(1)[0]).toBeGreaterThan(200);
  });

  it('should read short hex colours like their long form', () => {
    expect(emberPalette('#38f')(0.3)).toEqual(emberPalette('#3388ff')(0.3));
  });

  it('should clamp heat outside the ramp', () => {
    const palette = emberPalette(null);

    expect(palette(1.4)).toEqual(palette(1));
    expect(palette(-0.5)).toEqual(palette(0));
  });
});
