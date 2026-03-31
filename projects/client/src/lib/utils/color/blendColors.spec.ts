import { describe, expect, it } from 'vitest';
import { blendColors } from './blendColors.ts';

describe('blendColors', () => {
  it('should return base color at weight 0', () => {
    expect(blendColors('#000000', '#ffffff', 0)).toBe('#000000');
  });

  it('should return color at weight 1', () => {
    expect(blendColors('#000000', '#ffffff', 1)).toBe('#ffffff');
  });

  it('should blend two colors at weight 0.5', () => {
    expect(blendColors('#000000', '#ffffff', 0.5)).toBe('#808080');
  });

  it('should blend two hex colors at a given weight', () => {
    expect(blendColors('#000000', '#1b2b36', 0.2)).toBe('#05090b');
  });

  it('should return base when color is "transparent"', () => {
    expect(blendColors('#000000', 'transparent', 0.2)).toBe('#000000');
  });

  it('should return base when base is not a valid hex', () => {
    expect(blendColors('transparent', '#ffffff', 0.2)).toBe('transparent');
  });

  it('should return base when color is an empty string', () => {
    expect(blendColors('#000000', '', 0.2)).toBe('#000000');
  });
});
