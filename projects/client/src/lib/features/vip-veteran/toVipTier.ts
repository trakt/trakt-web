import type { TierAuraTier } from '$lib/components/tier-aura/TierAuraTier.ts';
import type { TieredMember } from './TieredMember.ts';
import { toVipLadderTier } from './toVipLadderTier.ts';

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
