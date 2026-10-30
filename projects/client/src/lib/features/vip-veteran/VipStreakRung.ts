import type { MemberLadderTier } from './MemberLadderTier.ts';

export type VipStreakRung = {
  tier: number;
  memberTier: MemberLadderTier;
  isReached: boolean;
  isCurrent: boolean;
};
