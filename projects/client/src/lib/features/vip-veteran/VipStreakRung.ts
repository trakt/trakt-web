import type { VipLadderTier } from './VipLadderTier.ts';

export type VipStreakRung = {
  tier: number;
  aura: VipLadderTier;
  isReached: boolean;
  isCurrent: boolean;
};
