import { getIntlLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';

const MONTHS_PER_YEAR = 12;

export function toVipTenureLabel(vipMonths: number): string {
  if (vipMonths < 1) return m.text_vip_cancel_tenure_new();

  const isYears = vipMonths >= MONTHS_PER_YEAR;
  return new Intl.NumberFormat(getIntlLocale(languageTag()), {
    style: 'unit',
    unit: isYears ? 'year' : 'month',
    unitDisplay: 'long',
  }).format(isYears ? Math.floor(vipMonths / MONTHS_PER_YEAR) : vipMonths);
}
