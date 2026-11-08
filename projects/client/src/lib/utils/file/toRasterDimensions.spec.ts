import { describe, expect, it } from 'vitest';
import { toRasterDimensions } from './toRasterDimensions.ts';

describe('util: toRasterDimensions', () => {
  it('should make a landscape image as wide as the size', () => {
    expect(toRasterDimensions({ width: 120, height: 30, size: 1024 })).toEqual({
      width: 1024,
      height: 256,
    });
  });

  it('should make a portrait image as tall as the size', () => {
    expect(toRasterDimensions({ width: 30, height: 120, size: 512 })).toEqual({
      width: 128,
      height: 512,
    });
  });

  it('should keep a square image square', () => {
    expect(toRasterDimensions({ width: 48, height: 48, size: 2048 })).toEqual({
      width: 2048,
      height: 2048,
    });
  });

  it('should round to whole pixels and never reach zero', () => {
    expect(toRasterDimensions({ width: 1311, height: 497, size: 512 })).toEqual(
      {
        width: 512,
        height: 194,
      },
    );
    expect(toRasterDimensions({ width: 1000, height: 1, size: 100 })).toEqual({
      width: 100,
      height: 1,
    });
  });

  it('should fall back to a square for an unusable ratio', () => {
    expect(toRasterDimensions({ width: 0, height: 10, size: 512 })).toEqual({
      width: 512,
      height: 512,
    });
  });
});
