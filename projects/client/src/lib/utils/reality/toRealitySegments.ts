import type { RealityTier } from '$lib/requests/models/RealityTier.ts';

export const REALITY_SEGMENT_COUNT = 4;

const SEGMENTS: Record<RealityTier, number> = {
  faithful: 4,
  mostly_true: 3,
  loose: 2,
  in_name_only: 1,
  unclear: 0,
};

export function toRealitySegments(tier: RealityTier): number {
  return SEGMENTS[tier];
}
