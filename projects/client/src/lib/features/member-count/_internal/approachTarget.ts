type ApproachTargetParams = {
  current: number;
  target: number;
  deltaMs: number;
  halfLifeMs: number;
};

/**
 * Exponential ease: after `halfLifeMs` the remaining distance to `target` has
 * halved. Keyed off elapsed time rather than a per-frame factor so 30fps and
 * 120fps devices reconcile over the same wall-clock duration.
 */
export function approachTarget(
  { current, target, deltaMs, halfLifeMs }: ApproachTargetParams,
): number {
  // Snapping here would defeat the easing on the first frame after a re-anchor.
  if (deltaMs <= 0) return current;
  if (halfLifeMs <= 0) return target;

  const factor = 1 - Math.pow(2, -deltaMs / halfLifeMs);

  return current + (target - current) * factor;
}
