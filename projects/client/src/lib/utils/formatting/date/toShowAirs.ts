import type { ShowAirs } from '$lib/requests/models/ShowEntry.ts';

const DAYS_INDEX: Record<string, number> = {
  "Sunday": 0,
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3,
  "Thursday": 4,
  "Friday": 5,
  "Saturday": 6,
};

/**
 * Converts a show's airs schedule to the user's local timezone.
 *
 * Takes the show's air day/time/timezone and returns the equivalent
 * day and formatted time in the user's browser timezone.
 */
export function toShowAirs(
  airs: ShowAirs,
  locale: string,
): { day: string; time: string } | undefined {
  const dayIndex = DAYS_INDEX[airs.day];
  if (dayIndex == null) {
    return;
  }

  const [hour, minute] = airs.time.split(':').map(Number);
  if (hour == null || minute == null) {
    return;
  }

  // Use a reference week (Jan 5, 2025 = Sunday) to create a date for the target day.
  // We set the time in UTC first, then calculate the offset to the show's timezone
  // so we can find the true UTC moment the show airs.
  const refDateMs = Date.UTC(2025, 0, 5 + dayIndex, hour, minute);

  // Find what time our UTC guess displays as in the show's timezone
  const tzParts = new Intl.DateTimeFormat('en-US', {
    timeZone: airs.timezone,
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    hour12: false,
  }).formatToParts(new Date(refDateMs));

  const tzHour = Number(
    tzParts.find((p) => p.type === 'hour')?.value ?? 0,
  );
  const tzMinute = Number(
    tzParts.find((p) => p.type === 'minute')?.value ?? 0,
  );
  const tzDay = Number(
    tzParts.find((p) => p.type === 'day')?.value ?? 0,
  );

  // Calculate offset between what we want in the show's tz vs what we got
  const refDay = 5 + dayIndex;
  const dayDiffMinutes = (refDay - tzDay) * 24 * 60;
  const timeDiffMinutes = (hour * 60 + minute) - (tzHour * 60 + tzMinute);
  const totalOffsetMs = (dayDiffMinutes + timeDiffMinutes) * 60 * 1000;

  // The actual UTC moment when the show airs
  const airsUtc = new Date(refDateMs + totalOffsetMs);

  // Format in the user's local timezone
  const dayStr = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
  }).format(airsUtc);

  const timeStr = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(airsUtc);

  return { day: dayStr, time: timeStr };
}
