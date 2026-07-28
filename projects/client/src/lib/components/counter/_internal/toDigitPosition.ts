// Fraction of a column's step during which the carry travels; outside it the
// column rests flush. Without a detent every column sits permanently
// part-rolled, which reads as a rendering fault rather than motion. The ones
// column gets a wide window so it is settled about half the time even at the
// real rate of ~1 signup every 8s.
const ONES_CARRY_WINDOW = 0.5;
const CARRY_WINDOW = 0.2;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Strip offset for the digit column at `place`, in the range [0, 10). Every
 * column derives its own offset from the same raw value, so no two can disagree
 * about a carry.
 */
export function toDigitPosition(
  { value, place }: { value: number; place: number },
): number {
  const scaled = Math.max(0, value) / Math.pow(10, place);
  const digit = Math.floor(scaled) % 10;
  const fraction = scaled - Math.floor(scaled);

  const window = place === 0 ? ONES_CARRY_WINDOW : CARRY_WINDOW;
  const travel = (fraction - (1 - window)) / window;

  return digit + smoothstep(Math.min(1, Math.max(0, travel)));
}
