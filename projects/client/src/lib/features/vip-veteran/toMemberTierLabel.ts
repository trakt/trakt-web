import * as m from '$lib/features/i18n/messages.ts';
import type { MemberTier } from './MemberTier.ts';

export function toMemberTierLabel(tier: MemberTier): string {
  switch (tier) {
    case 'pro':
      return m.text_vip_tier_pro();
    case 'veteran':
      return m.text_vip_veteran_title_veteran();
    case 'elite':
      return m.text_vip_tier_elite();
    case 'legend':
      return m.text_vip_veteran_title_legend();
    case 'original':
      return m.text_vip_tier_original();
    case 'director':
      return 'DIRECTOR';
    case 'free':
      return m.text_vip_tier_free();
    default:
      return 'VIP';
  }
}
