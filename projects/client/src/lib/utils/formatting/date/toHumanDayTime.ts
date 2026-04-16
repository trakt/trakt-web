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
  locale: string;
  now?: Date;
};

/**
 * Returns the most recent Sunday (midnight UTC) relative to the given date.
 * This ensures timezone offset calculations reflect the current DST state.
 */
function recentSunday(now: Date): number {
  const date = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
  );
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return date.getTime();
}

/**
 * Converts a broadcast day/time/timezone to the user's local day and time.
 *
 * Takes a day name (e.g. "Thursday"), time (e.g. "21:00"), and IANA timezone
 * (e.g. "America/New_York") and returns the equivalent day and formatted time
 * in the user's browser timezone, localized to the provided locale.
 */
export function toHumanDayTime(
  { day, time, timezone, locale, now = new Date() }: ToHumanDayTimeProps,
): { day: string; time: string } | undefined {
  const dayIndex = DAYS_INDEX[day];
  if (dayIndex == null) return;

  const [hourStr, minuteStr] = time.split(':');
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return;

  // Use the most recent Sunday to build a candidate UTC moment for
  // hour:minute on the target day. Using the current week ensures the
  // timezone offset calculation reflects the active DST state.
  const sundayMs = recentSunday(now);
  const refDayMs = sundayMs + dayIndex * 86_400_000;
  const refUtcMs = refDayMs + hour * 3_600_000 + minute * 60_000;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    hour12: false,
  }).formatToParts(new Date(refUtcMs));

  const sourceHour = Number(parts.find((p) => p.type === 'hour')?.value);
  const sourceMinute = Number(parts.find((p) => p.type === 'minute')?.value);
  const sourceDay = Number(parts.find((p) => p.type === 'day')?.value);

  if (
    !Number.isFinite(sourceHour) ||
    !Number.isFinite(sourceMinute) ||
    !Number.isFinite(sourceDay)
  ) {
    return;
  }

  const refDay = new Date(refUtcMs).getUTCDate();
  const dayDiffMinutes = (refDay - sourceDay) * 24 * 60;
  const timeDiffMinutes = (hour * 60 + minute) -
    (sourceHour * 60 + sourceMinute);
  const offsetMs = (dayDiffMinutes + timeDiffMinutes) * 60 * 1000;

  const utcDate = new Date(refUtcMs + offsetMs);

  const dayStr = new Intl.DateTimeFormat(locale, { weekday: 'long' })
    .format(utcDate);
  const timeStr = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(utcDate);

  return { day: dayStr, time: timeStr };
}
