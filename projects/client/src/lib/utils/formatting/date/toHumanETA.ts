import type { AvailableLocale } from '$lib/features/i18n/index.ts';

export function toHumanETA(
  today: Date,
  targetDate: Date,
  locale: AvailableLocale = 'en',
): string {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const days = Math.round(
    (targetDate.getTime() - today.getTime()) / MS_PER_DAY,
  );

  const isPastDate = days < 0;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const year = targetDate.getFullYear().toString();

  if (isPastDate) {
    return year;
  }

  if (days <= 6) {
    return rtf.format(days, 'day');
  }

  const weeks = Math.round(days / 7);
  if (weeks <= 3) {
    return rtf.format(weeks, 'week');
  }

  const months = Math.round(days / 30);
  if (months <= 6) {
    return rtf.format(months, 'month');
  }

  return year;
}
