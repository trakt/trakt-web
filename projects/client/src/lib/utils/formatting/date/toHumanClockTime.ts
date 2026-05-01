import type { AvailableLanguage } from '$lib/features/i18n/index.ts';

export function toHumanClockTime(
  date: Date,
  locale: AvailableLanguage = 'en',
): string {
  return date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
