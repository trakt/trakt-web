import type { AvailableLanguage } from '$lib/features/i18n/index.ts';

export function toHumanShortDate(
  date: Date,
  locale: AvailableLanguage = 'en',
): string {
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  });
}
