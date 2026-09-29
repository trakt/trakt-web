import type { AvailableLanguage } from '$lib/features/i18n/index.ts';

export function toHumanMonthYear(
  date: Date,
  locale: AvailableLanguage = 'en',
): string {
  return date.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
