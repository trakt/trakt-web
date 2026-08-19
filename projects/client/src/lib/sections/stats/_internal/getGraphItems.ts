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

  const days = labels.map((label, index) => {
    const minutes = thisWeek.dailyMinutes[index] ?? 0;

    return {
      label,
      minutes,
      percentage: Math.round((minutes / wakingMinutesPerDay) * 100),
    };
  });

  const buckets = bucketByTimeOfDay({
    movieDates: thisWeek.movieDates,
    showDates: thisWeek.showDates,
  });

  return [
    {
      type: 'graph',
      key: 'screenTimeDaily',
      kind: 'screenTimeDaily',
      isEmpty: days.every((day) => day.minutes === 0),
      data: {
        days,
      },
    },
    {
      type: 'graph',
      key: 'peakHours',
      kind: 'peakHours',
      isEmpty: buckets.every((bucket) => bucket.count === 0),
      data: {
        buckets,
      },
    },
  ];
}
