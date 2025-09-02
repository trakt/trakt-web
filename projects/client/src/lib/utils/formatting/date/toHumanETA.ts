import type { AvailableLocale } from '$lib/features/i18n/index.ts';

export function toHumanETA(
  today: Date,
  targetDate: Date,
  locale: AvailableLocale = 'en',
): string {
  const MS_PER_HOUR = 1000 * 60 * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;

  const timeDiff = targetDate.getTime() - today.getTime();
  const minutes = Math.round(timeDiff / (1000 * 60));
  const days = Math.round(timeDiff / MS_PER_DAY);
  const hours = Math.round(timeDiff / MS_PER_HOUR);

  const isPastDate = timeDiff < 0;

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const narrowRtf = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
    style: 'narrow',
  });

  const year = targetDate.getFullYear().toString();

  if (isPastDate) {
    return year;
  }

  const isTodayAfterMidnight = today.getHours() >= 0 &&
    today.getHours() < 6;

  const isTargetAfterMidnight = targetDate.getHours() >= 0 &&
    targetDate.getHours() < 6;

  const isSameDay = today.getFullYear() === targetDate.getFullYear() &&
    today.getMonth() === targetDate.getMonth() &&
    today.getDate() === targetDate.getDate();

  if (isSameDay) {
    if (hours === 0) {
      return narrowRtf.format(minutes, 'minute');
    }

    return rtf.format(hours, 'hour');
  }

  if (days <= 6) {
    const modifier = isTargetAfterMidnight && !isTodayAfterMidnight ? 1 : 0;
    return rtf.format(days + modifier, 'day');
  }

  const remainingDaysInWeek = days % 7;
  const exceedsCurrentWeek = today.getDay() + remainingDaysInWeek > 7;
  const additionalWeek = exceedsCurrentWeek ? 1 : 0;

  const weeks = Math.floor(days / 7) + additionalWeek;
  if (weeks <= 3) {
    return rtf.format(weeks, 'week');
  }

  const months = Math.round(days / 30);
  if (months <= 6) {
    return rtf.format(months, 'month');
  }

  return year;
}
