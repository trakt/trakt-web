import type { VipLadderTier } from './VipLadderTier.ts';
import type { VipTierTitle } from './VipTierTitle.ts';

type VipVeteranRung = {
  tier: number;
  title: VipTierTitle | null;
  aura: VipLadderTier;
};

export const VIP_VETERAN_LADDER: ReadonlyArray<VipVeteranRung> = [
  { tier: 1, title: null, aura: 'vip' },
  { tier: 3, title: 'pro', aura: 'pro' },
  { tier: 5, title: 'veteran', aura: 'veteran' },
  { tier: 7, title: 'elite', aura: 'elite' },
  { tier: 10, title: 'legend', aura: 'legend' },
];
