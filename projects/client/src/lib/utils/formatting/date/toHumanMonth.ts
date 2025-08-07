import type { AvailableLanguage } from '$lib/features/i18n/index.ts';

export function toHumanMonth(
  date: Date,
  locale: AvailableLanguage = 'en',
  format: 'short' | 'long' = 'long',
) {
  return date.toLocaleString(locale, {
    month: format,
  });
}
