import type { TieredUser } from '$lib/features/vip-veteran/TieredUser.ts';
import { toUserTier } from '$lib/features/vip-veteran/toUserTier.ts';

type ToMemberAuraToneParams = {
  member: TieredUser;
  isVeteranEnabled: boolean;
};

const VIP_AURA = 'var(--color-glow-vip-badge-vip)';

export function toMemberAuraTone({
  member,
  isVeteranEnabled,
}: ToMemberAuraToneParams): string {
  if (!isVeteranEnabled) return VIP_AURA;
  if (!member.isVip) return VIP_AURA;

  return `var(--color-user-tier-${toUserTier(member)}-ring)`;
}
