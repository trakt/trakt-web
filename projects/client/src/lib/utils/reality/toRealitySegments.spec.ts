import type { RealityTier } from '$lib/requests/models/RealityTier.ts';
import { describe, expect, it } from 'vitest';
import { toRealitySegments } from './toRealitySegments.ts';

describe('util: toRealitySegments', () => {
  it.each<[RealityTier, number]>([
    ['faithful', 4],
    ['mostly_true', 3],
    ['loose', 2],
    ['in_name_only', 1],
    ['unclear', 0],
  ])('should fill %s with %i segments', (tier, expected) => {
    expect(toRealitySegments(tier)).to.equal(expected);
  });
});
