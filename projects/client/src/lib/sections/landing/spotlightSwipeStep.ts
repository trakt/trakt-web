const SWIPE_THRESHOLD = 40;

type SpotlightSwipeStepParams = {
  dx: number;
  isTap: boolean;
  isRtl: boolean;
};

export function spotlightSwipeStep(
  { dx, isTap, isRtl }: SpotlightSwipeStepParams,
): number {
  if (isTap) return 1;
  if (Math.abs(dx) < SWIPE_THRESHOLD) return 0;

  const isForward = isRtl ? dx > 0 : dx < 0;
  return isForward ? 1 : -1;
}
