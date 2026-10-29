import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { toRelativeOrFormattedDate } from './_internal/toRelativeOrFormattedDate.ts';

export function toHumanDate(
  today: Date,
  date: Date,
  localeKey: AvailableLocale,
): string {
  return toRelativeOrFormattedDate({ today, date, localeKey, pattern: 'PPPp' });
}
