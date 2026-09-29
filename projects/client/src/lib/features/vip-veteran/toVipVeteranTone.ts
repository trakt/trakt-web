import type { VipBadgeTone } from '$lib/components/badge/VipBadgeTone.ts';

export function toVipVeteranTone(tier: number): VipBadgeTone {
  if (tier >= 10) return 'gold';
  if (tier >= 7) return 'silver';
  if (tier >= 5) return 'copper';
  if (tier >= 3) return 'deep';
  return 'vip';
}
