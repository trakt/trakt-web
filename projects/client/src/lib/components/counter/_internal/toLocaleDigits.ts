import { getIntlLocale } from '$lib/features/i18n/index.ts';
import type { AvailableLanguage } from '$lib/features/i18n/index.ts';

/**
 * The locale's own 0-9 glyphs, in order, for building a roll strip. Hardcoding
 * `'0123456789'` would print Latin digits next to `fa-IR` separators.
 */
export function toLocaleDigits(locale: string): string[] {
  const formatter = new Intl.NumberFormat(
    getIntlLocale(locale as AvailableLanguage),
    { useGrouping: false },
  );

  return Array.from({ length: 10 }, (_, digit) => formatter.format(digit));
}
