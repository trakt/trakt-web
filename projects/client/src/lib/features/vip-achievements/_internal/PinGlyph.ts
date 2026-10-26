import type { PinShape } from './PinShape.ts';

/**
 * A pin's artwork. `shapes` is the enamel, with cut-outs that show the metal
 * beneath; `solid` is the silhouette without them, which the metal backing is
 * drawn from. Without `solid` the backing reuses `shapes`. Artwork is fitted to
 * the shared artboard automatically (`toPinGlyphFrame`); `optical` shrinks a
 * heavy, boxy shape a touch so it does not look bigger than an airy one.
 */
export type PinGlyph = {
  shapes: ReadonlyArray<PinShape>;
  solid?: ReadonlyArray<PinShape>;
  optical?: number;
};
