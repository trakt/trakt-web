import { getIntlLocale } from '$lib/features/i18n/index.ts';
import type {
  AvailableLanguage,
  AvailableLocale,
} from '$lib/features/i18n/index.ts';

const formatters = new Map<string, Intl.NumberFormat>();

export function toGroupedNumber(
  value: number,
  locale: AvailableLocale | AvailableLanguage | string = 'en',
) {
  const intlLocale = getIntlLocale(locale as AvailableLanguage);
  const cached = formatters.get(intlLocale);
  const formatter = cached ??
    new Intl.NumberFormat(intlLocale, { maximumFractionDigits: 0 });

  if (!cached) formatters.set(intlLocale, formatter);

  return formatter.format(value);
}
