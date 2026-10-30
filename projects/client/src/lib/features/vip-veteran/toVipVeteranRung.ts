import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { VIP_VETERAN_LADDER } from './VIP_VETERAN_LADDER.ts';

type LadderPlace = Pick<VipVeteran, 'tier' | 'years'>;

// The API ranks up to Legend (10); past it, the streak's years carry on.
const API_TOP_TIER = 10;

function toLadderTier({ tier, years }: LadderPlace) {
  return tier >= API_TOP_TIER ? Math.max(tier, years) : tier;
}

export function toVipVeteranRung(place: LadderPlace) {
  const ladderTier = toLadderTier(place);
  return VIP_VETERAN_LADDER.findLast((rung) => ladderTier >= rung.tier);
}
