import { m } from '$lib/features/i18n/messages.ts';

type VipDuration = 'monthly' | 'yearly' | 'two_years' | 'life';

export function toVipDurationLabel(type: VipDuration | Nil): string | null {
  switch (type) {
    case 'monthly':
      return m.text_vip_billing_cycle_monthly();
    case 'yearly':
      return m.text_vip_billing_cycle_year({ years: '1' });
    case 'two_years':
      return m.text_vip_billing_cycle_year({ years: '2' });
    default:
      return null;
  }
}
