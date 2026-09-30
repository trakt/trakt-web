import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { toHumanClockTime } from '$lib/utils/formatting/date/toHumanClockTime.ts';
import { toRelativeHumanDay } from '$lib/utils/formatting/date/toRelativeHumanDay.ts';

export function toFriendActionTime(activityAt: Date, now = new Date()): string {
  const time = toHumanClockTime(activityAt, languageTag());

  if (getDayKey(activityAt) === getDayKey(now)) return time;

  return m.text_today_day_time({
    day: toRelativeHumanDay(now, activityAt, getLocale()),
    time,
  });
}
