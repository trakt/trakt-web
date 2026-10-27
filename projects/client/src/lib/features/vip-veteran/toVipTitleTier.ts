import { VIP_VETERAN_LADDER } from './VIP_VETERAN_LADDER.ts';
import type { VipLadderTier } from './VipLadderTier.ts';
import type { VipTierTitle } from './VipTierTitle.ts';

export function toVipTitleTier(title: VipTierTitle | null): VipLadderTier {
  return VIP_VETERAN_LADDER.find((rung) => rung.title === title)?.aura ?? 'vip';
}
