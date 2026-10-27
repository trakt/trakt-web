import type { VipLadderTier } from './VipLadderTier.ts';
import type { VipTierTitle } from './VipTierTitle.ts';

export type VipStreakRung = {
  tier: number;
  title: VipTierTitle | null;
  aura: VipLadderTier;
  isReached: boolean;
  isCurrent: boolean;
};
