import * as m from '$lib/features/i18n/messages.ts';
import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';

export function toVipVeteranLabel(title: VipVeteran['title']): string {
  switch (title) {
    case 'legend':
      return m.text_vip_veteran_title_legend();
    case 'veteran':
      return m.text_vip_veteran_title_veteran();
    default:
      return 'VIP';
  }
}
