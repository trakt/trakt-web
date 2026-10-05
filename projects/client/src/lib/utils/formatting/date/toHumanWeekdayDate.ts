import {
  type AvailableLocale,
  getIntlLocale,
} from '$lib/features/i18n/index.ts';

export function toHumanWeekdayDate(
  date: Date,
  locale: AvailableLocale,
): string {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}
