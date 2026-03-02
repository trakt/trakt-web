const DAYS_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

type ToHumanDayTimeProps = {
  day: string;
  time: string;
  timezone: string;
};

/**
 * Converts a day/time/timezone to the user's local timezone.
 *
 * Takes a day name (e.g. "Thursday"), time (e.g. "21:00"), and
 * IANA timezone (e.g. "America/New_York") and returns the equivalent
 * day and formatted time in the user's browser timezone.
 */
export function toHumanDayTime(
  { day, time, timezone }: ToHumanDayTimeProps,
  locale: string,
): { day: string; time: string } | undefined {
  const dayIndex = DAYS_INDEX[day];
  if (dayIndex == null) {
    return;
  }

  const [hour, minute] = time.split(':').map(Number);
  if (hour == null || minute == null) {
    return;
  }

  // Use a reference week (Jan 5, 2025 = Sunday) to create a date for the target day.
  // We set the time in UTC first, then calculate the offset to the source timezone
  // so we can find the true UTC moment.
  const refDateMs = Date.UTC(2025, 0, 5 + dayIndex, hour, minute);

  // Find what time our UTC guess displays as in the source timezone
  const tzParts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    hour12: false,
  }).formatToParts(new Date(refDateMs));

  const tzHourStr = tzParts.find((p) => p.type === 'hour')?.value;
  const tzMinuteStr = tzParts.find((p) => p.type === 'minute')?.value;
  const tzDayStr = tzParts.find((p) => p.type === 'day')?.value;

  if (tzHourStr == null || tzMinuteStr == null || tzDayStr == null) {
    return;
  }

  const tzHour = Number(tzHourStr);
  const tzMinute = Number(tzMinuteStr);
  const tzDay = Number(tzDayStr);

  // Calculate offset between what we want in the source tz vs what we got
  const refDay = 5 + dayIndex;
  const dayDiffMinutes = (refDay - tzDay) * 24 * 60;
  const timeDiffMinutes = (hour * 60 + minute) - (tzHour * 60 + tzMinute);
  const totalOffsetMs = (dayDiffMinutes + timeDiffMinutes) * 60 * 1000;

  // The actual UTC moment
  const utcDate = new Date(refDateMs + totalOffsetMs);

  // Format in the user's local timezone
  const dayStr = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
  }).format(utcDate);

  const timeStr = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(utcDate);

  return { day: dayStr, time: timeStr };
}
