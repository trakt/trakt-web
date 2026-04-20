import type { AvailableLanguage } from '$lib/features/i18n/index.ts';

export function toHumanLongDate(
  date: Date,
  locale: AvailableLanguage = 'en',
): string {
  return date.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
