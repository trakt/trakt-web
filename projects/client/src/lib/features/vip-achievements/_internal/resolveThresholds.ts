type ResolveThresholdsParams = {
  /** Current raw metric value. */
  value: number;
  /** Ascending, positive tier thresholds (T1 -> Tn). */
  thresholds: ReadonlyArray<number>;
};

type ThresholdResolution = {
  /** Zero-based index of the highest reached tier, or `-1` while locked. */
  tierIndex: number;
  /** Threshold of the next tier, or `null` once maxed. */
  nextThreshold: number | null;
  /** Progress toward the next tier, clamped to `0..1` (always `1` when maxed). */
  progress: number;
  /** `true` once the highest threshold is reached. */
  isMaxed: boolean;
};

/**
 * Resolve a raw metric value against an ascending threshold chain into the
 * reached tier and fractional progress toward the next one. Pure and
 * locale-agnostic.
 */
export function resolveThresholds(
  { value, thresholds }: ResolveThresholdsParams,
): ThresholdResolution {
  if (thresholds.length === 0) {
    return { tierIndex: -1, nextThreshold: null, progress: 1, isMaxed: true };
  }

  const tierIndex = thresholds.reduce(
    (reached, threshold, index) => (value >= threshold ? index : reached),
    -1,
  );

  const nextThreshold = thresholds.at(tierIndex + 1) ?? null;

  if (nextThreshold === null) {
    return { tierIndex, nextThreshold: null, progress: 1, isMaxed: true };
  }

  const floor = tierIndex >= 0 ? thresholds.at(tierIndex) ?? 0 : 0;
  const span = nextThreshold - floor;
  const ratio = span <= 0 ? 0 : (value - floor) / span;

  return {
    tierIndex,
    nextThreshold,
    progress: Math.min(Math.max(ratio, 0), 1),
    isMaxed: false,
  };
}
