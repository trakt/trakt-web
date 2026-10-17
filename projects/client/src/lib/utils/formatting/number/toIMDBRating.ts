import { getIntlLocale } from '$lib/features/i18n/index.ts';
import type {
  AvailableLanguage,
  AvailableLocale,
} from '$lib/features/i18n/index.ts';
import { createNumberFormatCache } from './_internal/createNumberFormatCache.ts';

const getFormatter = createNumberFormatCache({
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function toIMDBRating(
  rating: number,
  locale: AvailableLocale | AvailableLanguage | string,
): string {
  return getFormatter(getIntlLocale(locale as AvailableLanguage)).format(
    rating,
  );
}
