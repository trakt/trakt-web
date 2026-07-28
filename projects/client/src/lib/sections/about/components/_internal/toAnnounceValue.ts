const ANNOUNCE_GRANULARITY = 100_000;

/**
 * Coarsen a live count to the value a screen reader should hear. Separate from
 * formatting on purpose: a `$derived` off this only recomputes when the
 * announced magnitude moves, keeping `Intl` out of the frame loop.
 */
export function toAnnounceValue(value: number): number {
  return Math.floor(value / ANNOUNCE_GRANULARITY) * ANNOUNCE_GRANULARITY;
}
