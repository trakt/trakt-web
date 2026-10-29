import type { VipLadderTier } from './VipLadderTier.ts';

type VipVeteranRung = {
  tier: number;
  aura: VipLadderTier;
};

export const VIP_VETERAN_LADDER: ReadonlyArray<VipVeteranRung> = [
  { tier: 1, aura: 'vip' },
  { tier: 3, aura: 'pro' },
  { tier: 5, aura: 'veteran' },
  { tier: 7, aura: 'elite' },
  { tier: 10, aura: 'legend' },
];
