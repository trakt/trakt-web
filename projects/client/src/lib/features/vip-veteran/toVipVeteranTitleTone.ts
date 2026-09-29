import type { VipBadgeTone } from '$lib/components/badge/VipBadgeTone.ts';
import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { VIP_VETERAN_LADDER } from './VIP_VETERAN_LADDER.ts';

export function toVipVeteranTitleTone(
  title: VipVeteran['title'],
): VipBadgeTone {
  return VIP_VETERAN_LADDER.findLast((rung) => rung.title === (title ?? null))
    ?.tone ?? 'vip';
}
