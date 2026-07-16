import { getIntlLocale } from '$lib/features/i18n/index.ts';
import type {
  AvailableLanguage,
  AvailableLocale,
} from '$lib/features/i18n/index.ts';

export function toPercentage(
  value: number,
  locale: AvailableLocale | AvailableLanguage | string = 'en',
) {
  return new Intl.NumberFormat(getIntlLocale(locale as AvailableLanguage), {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value);
}
