import type { AvailableLanguage } from '$lib/features/i18n/index.ts';

/**
 * Compact hour-of-day label without minutes, e.g. "12am" / "1pm" (12-hour
 * locales) or "13" (24-hour locales). Used for hourly chart axes where the
 * ":00" from {@link toHumanClockTime} is redundant noise.
 */
export function toHumanClockHour(
  date: Date,
  locale: AvailableLanguage = 'en',
): string {
  return date
    .toLocaleTimeString(locale, { hour: 'numeric' })
    .replace(/\s+/g, '')
    .toLowerCase();
}
