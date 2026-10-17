import { getIntlLocale } from '$lib/features/i18n/index.ts';
import type {
  AvailableLanguage,
  AvailableLocale,
} from '$lib/features/i18n/index.ts';
import { createNumberFormatCache } from './_internal/createNumberFormatCache.ts';

const getFormatter = createNumberFormatCache({
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function toHumanNumber(
  value: number,
  locale: AvailableLocale | AvailableLanguage | string = 'en',
) {
  return getFormatter(getIntlLocale(locale as AvailableLanguage)).format(value);
}
