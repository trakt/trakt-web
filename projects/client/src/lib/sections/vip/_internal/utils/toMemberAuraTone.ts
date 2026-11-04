import type { VipBadgeTone } from '$lib/components/badge/VipBadgeTone.ts';
import type { TieredUser } from '$lib/features/vip-veteran/TieredUser.ts';
import { toVipVeteranTone } from '$lib/features/vip-veteran/toVipVeteranTone.ts';

type ToMemberAuraToneParams = {
  member: TieredUser;
  isVeteranEnabled: boolean;
};

export function toMemberAuraTone({
  member,
  isVeteranEnabled,
}: ToMemberAuraToneParams): VipBadgeTone {
  if (!isVeteranEnabled) return 'vip';
  if (!member.isVip) return 'vip';
  if (!member.veteran) return 'vip';

  return toVipVeteranTone(member.veteran.tier);
}
