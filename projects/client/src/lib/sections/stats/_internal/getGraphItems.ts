import { getLocale } from '$lib/features/i18n/index.ts';
import type { PulseGraphItem } from './models/PulseGraphItem.ts';
import type { WeekData } from './models/WeekData.ts';
import { bucketByTimeOfDay } from './utils/bucketByTimeOfDay.ts';
import { countByCalendarDay } from './utils/countByCalendarDay.ts';

interface GetGraphItemsParams {
  readonly thisWeek: WeekData;
  readonly now: Date;
  readonly wakingHoursPerDay: number;
}

export function getGraphItems(
  { thisWeek, now, wakingHoursPerDay }: GetGraphItemsParams,
): PulseGraphItem[] {
  const locale = getLocale();
  const twAll = [...thisWeek.movieDates, ...thisWeek.showDates];

  const { labels } = countByCalendarDay({ dates: twAll, now, locale });
  const wakingMinutesPerDay = wakingHoursPerDay * 60;
  const percentages = thisWeek.dailyMinutes.map((minutes) =>
    Math.round((minutes / wakingMinutesPerDay) * 100)
  );

  return [
    {
      type: 'graph',
      key: 'screenTimeDaily',
      kind: 'screenTimeDaily',
      data: {
        percentages,
        minutesPerDay: thisWeek.dailyMinutes,
        labels,
      },
    },
    {
      type: 'graph',
      key: 'peakHours',
      kind: 'peakHours',
      data: {
        buckets: bucketByTimeOfDay(twAll),
      },
    },
  ];
}
