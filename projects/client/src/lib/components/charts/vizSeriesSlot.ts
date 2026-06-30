const VIZ_SLOT_COUNT = 8;

/**
 * Map a zero-based series index onto a `1..8` viz palette slot, wrapping for
 * series beyond eight. Both the color token (`var(--viz-{slot})`) and the
 * high-contrast hatch pattern id derive from this slot, so series colour and
 * shape stay in lockstep.
 */
export function vizSeriesSlot(index: number): number {
  const wrapped = ((index % VIZ_SLOT_COUNT) + VIZ_SLOT_COUNT) % VIZ_SLOT_COUNT;
  return wrapped + 1;
}
