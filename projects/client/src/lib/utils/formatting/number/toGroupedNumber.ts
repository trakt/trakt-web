import { getIntlLocale } from '$lib/features/i18n/index.ts';
import type {
  AvailableLanguage,
  AvailableLocale,
} from '$lib/features/i18n/index.ts';
import { createNumberFormatCache } from './_internal/createNumberFormatCache.ts';

const getFormatter = createNumberFormatCache({ maximumFractionDigits: 0 });

export function toGroupedNumber(
  value: number,
  locale: AvailableLocale | AvailableLanguage | string = 'en',
) {
  return getFormatter(getIntlLocale(locale as AvailableLanguage)).format(value);
}
