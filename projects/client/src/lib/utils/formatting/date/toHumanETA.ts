import type { AvailableLocale } from '$lib/features/i18n/index.ts';

export function toHumanETA(
  today: Date,
  targetDate: Date,
  locale: AvailableLocale = 'en',
): string {
  const MS_PER_HOUR = 1000 * 60 * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;

  const timeDiff = targetDate.getTime() - today.getTime();
  const days = Math.ceil(timeDiff / MS_PER_DAY);
  const hours = Math.ceil(timeDiff / MS_PER_HOUR);

  const isPastDate = timeDiff < 0;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const year = targetDate.getFullYear().toString();

  if (isPastDate) {
    return year;
  }

  const isTargetAfterMidnight = targetDate.getUTCHours() >= 0 &&
    targetDate.getUTCHours() < 6;

  const isSameDay = today.getUTCFullYear() === targetDate.getUTCFullYear() &&
    today.getUTCMonth() === targetDate.getUTCMonth() &&
    today.getUTCDate() === targetDate.getUTCDate();

  if (isSameDay && !isTargetAfterMidnight) {
    return rtf.format(hours, 'hour');
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
