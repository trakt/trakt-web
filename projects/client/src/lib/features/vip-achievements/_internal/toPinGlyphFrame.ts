import { measurePinGlyph } from './measurePinGlyph.ts';
import type { PinGlyph } from './PinGlyph.ts';

/** The centred square of the 100-unit artboard every pin's artwork fills. */
const SAFE_AREA = 80;
const CENTER = 50;

type PinGlyphFrame = {
  x: number;
  y: number;
  /** Uniform, so the artwork keeps its proportions. */
  scale: number;
};

/**
 * Fits a pin's artwork onto the shared artboard: scaled so its longer side
 * spans the safe area (times its optical nudge), then centred. Artwork can be
 * drawn anywhere in its box and still sits exactly like every other pin, so
 * swapping one achievement's art for another never shifts the layout.
 */
export function toPinGlyphFrame(glyph: PinGlyph): PinGlyphFrame {
  const bounds = measurePinGlyph(glyph);
  const scale =
    (SAFE_AREA * (glyph.optical ?? 1)) / Math.max(bounds.width, bounds.height);
  return {
    x: CENTER - scale * (bounds.x + bounds.width / 2),
    y: CENTER - scale * (bounds.y + bounds.height / 2),
    scale,
  };
}
