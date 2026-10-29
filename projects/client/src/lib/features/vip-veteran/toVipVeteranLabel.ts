import * as m from '$lib/features/i18n/messages.ts';
import type { VipLadderTier } from './VipLadderTier.ts';

export function toVipVeteranLabel(tier: VipLadderTier | null): string {
  switch (tier) {
    case 'legend':
      return m.text_vip_veteran_title_legend();
    case 'elite':
      return m.text_vip_veteran_title_elite();
    case 'veteran':
      return m.text_vip_veteran_title_veteran();
    case 'pro':
      return m.text_vip_veteran_title_pro();
    default:
      return 'VIP';
  }
}
