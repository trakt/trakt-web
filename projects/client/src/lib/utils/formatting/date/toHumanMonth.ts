import type { AvailableLanguage } from '$lib/features/i18n/index.ts';

export function toHumanMonth(date: Date, locale: AvailableLanguage = 'en') {
  return date.toLocaleString(locale, {
    month: 'long',
  });
}
