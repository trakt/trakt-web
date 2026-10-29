import { VIP_VETERAN_LADDER } from './VIP_VETERAN_LADDER.ts';
import type { VipLadderTier } from './VipLadderTier.ts';

export function toVipLadderTier(tier: number): VipLadderTier {
  return (
    VIP_VETERAN_LADDER.findLast((rung) => tier >= rung.tier)?.aura ?? 'vip'
  );
}
