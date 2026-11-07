const MIN_SWEEP = 16;
const MAX_SWEEP = 180 - MIN_SWEEP;

export function matchFaceSweep(score: number): number {
  return Math.min(MAX_SWEEP, Math.max(MIN_SWEEP, score * 1.8));
}
