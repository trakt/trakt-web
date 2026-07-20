import { getIntlLocale } from '$lib/features/i18n/index.ts';
import type {
  AvailableLanguage,
  AvailableLocale,
} from '$lib/features/i18n/index.ts';

export function toHumanNumber(
  value: number,
  locale: AvailableLocale | AvailableLanguage | string = 'en',
) {
  const formatter = Intl.NumberFormat(
    getIntlLocale(locale as AvailableLanguage),
    {
      notation: 'compact',
      maximumFractionDigits: 1,
    },
  );

  return formatter.format(value);
}
