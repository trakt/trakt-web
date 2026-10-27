import type { TierAuraTier } from '$lib/components/tier-aura/TierAuraTier.ts';
import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { toVipLadderTier } from './toVipLadderTier.ts';

type TieredMember = {
  isVip: boolean;
  isDirector?: boolean;
  veteran?: VipVeteran | Nil;
};

// Directors outrank every streak; members without one are plain VIP.
export function toVipTier({
  isVip,
  isDirector,
  veteran,
}: TieredMember): TierAuraTier {
  if (isDirector) return 'director';
  if (!isVip) return 'free';
  if (!veteran) return 'vip';

  return toVipLadderTier(veteran.tier);
}
