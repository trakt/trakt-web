import { toVipLadderTier } from './toVipLadderTier.ts';
import type { VipTierTitle } from './VipTierTitle.ts';

export function toVipTierTitle(tier: number): VipTierTitle | null {
  const aura = toVipLadderTier(tier);
  return aura === 'vip' ? null : aura;
}
