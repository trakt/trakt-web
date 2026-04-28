import { getLocale } from '$lib/features/i18n/index.ts';
import type { PulseGraphData } from './models/PulseGraphData.ts';
import type { PulseGraphItem } from './models/PulseGraphItem.ts';
import type { WeekData } from './models/WeekData.ts';
import { bucketByTimeOfDay } from './utils/bucketByTimeOfDay.ts';
import { computeRatingsDistribution } from './utils/computeRatingsDistribution.ts';
import { computeWeekTrend } from './utils/computeWeekTrend.ts';
import { countByCalendarDay } from './utils/countByCalendarDay.ts';
import { normalizeScore } from './utils/normalizeScore.ts';
import { graphScoreMax } from './utils/pickGraphs.ts';

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

  const graphData: PulseGraphData = {
    dailyBars: countByCalendarDay({ dates: twAll, now, locale }),
    weekTrend: {
      weeks: computeWeekTrend([], now),
    },
    watchClock: {
      buckets: bucketByTimeOfDay(twAll),
    },
    showsMovies: {
      episodes: thisWeek.showDates.length,
      movies: thisWeek.movieDates.length,
    },
    ratingsDistribution: computeRatingsDistribution(
      thisWeek.ratings.map((r) => r.rating),
    ),
    screenTimeDaily: {
      percentages,
      minutesPerDay: thisWeek.dailyMinutes,
      labels,
    },
  };

  const graphs: Array<
    { type: 'screenTimeDaily' | 'watchClock'; score: number }
  > = [
    { type: 'screenTimeDaily', score: 10 },
    { type: 'watchClock', score: 9 },
  ];

  return graphs.map((g) => ({
    type: 'graph',
    key: g.type,
    kind: g.type,
    data: graphData,
    score: normalizeScore(g.score, graphScoreMax),
  }));
}
