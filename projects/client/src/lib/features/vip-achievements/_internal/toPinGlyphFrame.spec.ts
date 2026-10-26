import { describe, expect, it } from 'vitest';
import { measurePinGlyph } from './measurePinGlyph.ts';
import type { PinGlyph } from './PinGlyph.ts';
import { pinGlyphs } from './pinGlyphs.ts';
import { toPinGlyphFrame } from './toPinGlyphFrame.ts';

describe('util: toPinGlyphFrame', () => {
  describe.each(Object.entries(pinGlyphs))('glyph: %s', (_, glyph) => {
    const bounds = measurePinGlyph(glyph);
    const { x, y, scale } = toPinGlyphFrame(glyph);
    const fitted = {
      left: x + bounds.x * scale,
      top: y + bounds.y * scale,
      width: bounds.width * scale,
      height: bounds.height * scale,
    };

    it('should centre the artwork on the artboard', () => {
      expect(fitted.left + fitted.width / 2).toBeCloseTo(50, 5);
      expect(fitted.top + fitted.height / 2).toBeCloseTo(50, 5);
    });

    it('should stretch the longer side across the safe area', () => {
      const safeArea = 80 * ((glyph as PinGlyph).optical ?? 1);
      expect(Math.max(fitted.width, fitted.height)).toBeCloseTo(safeArea, 5);
    });

    it('should stay inside the safe area', () => {
      expect(fitted.left).toBeGreaterThanOrEqual(10 - 1e-6);
      expect(fitted.top).toBeGreaterThanOrEqual(10 - 1e-6);
      expect(fitted.left + fitted.width).toBeLessThanOrEqual(90 + 1e-6);
      expect(fitted.top + fitted.height).toBeLessThanOrEqual(90 + 1e-6);
    });
  });
});
