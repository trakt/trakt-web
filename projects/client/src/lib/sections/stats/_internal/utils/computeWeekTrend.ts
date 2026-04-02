import * as m from '$lib/features/i18n/messages.ts';
import { getStartOfDay } from '$lib/utils/date/getStartOfDay.ts';
import { subtractDays } from '$lib/utils/date/subtractDays.ts';

const daysInWeek = 7;
const trendWeekCount = 4;

export function computeWeekTrend(
  dates: ReadonlyArray<Date>,
  now: Date,
): ReadonlyArray<{ readonly label: string; readonly plays: number }> {
  const today = getStartOfDay(now);
  const labels = [
    m.text_stats_weeks_ago({ count: '4' }),
    m.text_stats_weeks_short({ count: '3' }),
    m.text_stats_weeks_short({ count: '2' }),
    m.text_stats_this_week(),
  ];

  return Array.from({ length: trendWeekCount }, (_, idx) => {
    const i = trendWeekCount - 1 - idx;
    const start = subtractDays(today, i * daysInWeek + daysInWeek - 1);
    const end = subtractDays(today, i * daysInWeek - 1);
    const count = dates.filter((d) => d >= start && d < end).length;
    return { label: labels[idx] ?? '', plays: count };
  });
}
