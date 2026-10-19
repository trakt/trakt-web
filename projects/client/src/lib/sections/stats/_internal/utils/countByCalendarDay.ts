import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { getStartOfDay } from '$lib/utils/date/getStartOfDay.ts';
import { subtractDays } from '$lib/utils/date/subtractDays.ts';
import { toHumanDayOfWeek } from '$lib/utils/formatting/date/toHumanDayOfWeek.ts';
import { DAYS_IN_WEEK } from '$lib/utils/constants.ts';

export function countByCalendarDay({
  dates,
  now,
  locale,
}: {
  dates: ReadonlyArray<Date>;
  now: Date;
  locale: AvailableLocale;
}): { readonly days: readonly number[]; readonly labels: readonly string[] } {
  const today = getStartOfDay(now);
  const dayRange = Array.from({ length: DAYS_IN_WEEK }, (_, idx) =>
    subtractDays(today, DAYS_IN_WEEK - 1 - idx),
  );

  const days = dayRange.map((day) => {
    const key = getDayKey(day);
    return dates.filter((d) => getDayKey(d) === key).length;
  });

  const labels = dayRange.map((day, idx) =>
    idx === DAYS_IN_WEEK - 1
      ? m.text_stats_today()
      : toHumanDayOfWeek(day, locale),
  );

  return { days, labels };
}
