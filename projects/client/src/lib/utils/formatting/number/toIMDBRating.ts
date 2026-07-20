import { getIntlLocale } from '$lib/features/i18n/index.ts';
import type {
  AvailableLanguage,
  AvailableLocale,
} from '$lib/features/i18n/index.ts';

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(
  locale: AvailableLocale | AvailableLanguage | string,
): Intl.NumberFormat {
  const cached = formatterCache.get(locale);
  if (cached) return cached;

  const formatter = new Intl.NumberFormat(
    getIntlLocale(locale as AvailableLanguage),
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
  );
  formatterCache.set(locale, formatter);

  return formatter;
}

export function toIMDBRating(
  rating: number,
  locale: AvailableLocale | AvailableLanguage | string,
): string {
  return getFormatter(locale).format(rating);
}
