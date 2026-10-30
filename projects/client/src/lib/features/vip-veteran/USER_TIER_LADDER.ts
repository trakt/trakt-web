import type { UserTierRung } from './UserTierRung.ts';

export const USER_TIER_LADDER: ReadonlyArray<UserTierRung> = [
  { tier: 1, userTier: 'vip' },
  { tier: 3, userTier: 'pro' },
  { tier: 5, userTier: 'veteran' },
  { tier: 7, userTier: 'elite' },
  { tier: 10, userTier: 'legend' },
];
