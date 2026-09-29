import type { VipBadgeTone } from '$lib/components/badge/VipBadgeTone.ts';
import { VIP_VETERAN_LADDER } from './VIP_VETERAN_LADDER.ts';

export function toVipVeteranTone(tier: number): VipBadgeTone {
  return VIP_VETERAN_LADDER.findLast((rung) => tier >= rung.tier)?.tone ??
    'vip';
}
