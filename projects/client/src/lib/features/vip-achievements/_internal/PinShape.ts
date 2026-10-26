type PinFill = {
  kind: 'fill';
  d: string;
  /** Extra outline in the fill's own paint, which softens sharp corners. */
  round?: number;
};

type PinStroke = {
  kind: 'stroke';
  d: string;
  width: number;
};

type PinKnockout = {
  d: string;
  width: number;
  isFilled: boolean;
  /** Limits the cut to one half of the box, so two links can interlock. */
  half?: 'top' | 'bottom';
  transform?: string;
};

/**
 * One part of a pin's artwork, in a 100-unit box. A knockout cuts a gap where
 * another part passes in front, so the metal beneath shows between them.
 */
export type PinShape = (PinFill | PinStroke) & {
  transform?: string;
  knockout?: PinKnockout;
};
