import type { MemberLadderTier } from './MemberLadderTier.ts';

type VipVeteranRung = {
  tier: number;
  memberTier: MemberLadderTier;
};

export const VIP_VETERAN_LADDER: ReadonlyArray<VipVeteranRung> = [
  { tier: 1, memberTier: 'vip' },
  { tier: 3, memberTier: 'pro' },
  { tier: 5, memberTier: 'veteran' },
  { tier: 7, memberTier: 'elite' },
  { tier: 10, memberTier: 'legend' },
  { tier: 15, memberTier: 'original' },
];
