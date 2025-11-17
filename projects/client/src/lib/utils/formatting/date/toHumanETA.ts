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
    // Calculate actual day difference based on calendar days, not rounded time
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const targetStart = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
    );
    const actualDaysDiff = Math.round(
      (targetStart.getTime() - todayStart.getTime()) / MS_PER_DAY,
    );

    return rtf.format(actualDaysDiff, 'day');
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
