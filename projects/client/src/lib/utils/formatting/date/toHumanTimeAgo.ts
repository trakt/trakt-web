import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { formatDistance } from 'date-fns/formatDistance';
import { toDateFnsLocale } from './toDateFnsLocale.ts';

export function toHumanTimeAgo(
  now: Date,
  date: Date,
  localeKey: AvailableLocale,
): string {
  return formatDistance(date, now, {
    addSuffix: true,
    locale: toDateFnsLocale(localeKey),
  });
}
