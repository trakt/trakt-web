import type { AvailableLanguage } from '$lib/features/i18n/index.ts';

export function toHumanHour(
  date: Date,
  locale: AvailableLanguage = 'en',
): string {
  return date.toLocaleTimeString(locale, {
    hour: 'numeric',
  });
}
