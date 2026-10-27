import { VIP_VETERAN_LADDER } from './VIP_VETERAN_LADDER.ts';
import type { VipTierTitle } from './VipTierTitle.ts';

// The API only names veteran and legend; the ladder names every step.
export function toVipTierTitle(tier: number): VipTierTitle | null {
  return (
    VIP_VETERAN_LADDER.findLast((rung) => tier >= rung.tier)?.title ?? null
  );
}
