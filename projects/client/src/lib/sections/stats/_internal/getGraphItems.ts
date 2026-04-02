import { getLocale } from '$lib/features/i18n/index.ts';
import type { PulseGraphData } from './models/PulseGraphData.ts';
import type { PulseGraphItem } from './models/PulseGraphItem.ts';
import type { WeekData } from './models/WeekData.ts';
import { bucketByTimeOfDay } from './utils/bucketByTimeOfDay.ts';
import { computeRatingsDistribution } from './utils/computeRatingsDistribution.ts';
import { computeWeekTrend } from './utils/computeWeekTrend.ts';
import { countByCalendarDay } from './utils/countByCalendarDay.ts';
import { normalizeScore } from './utils/normalizeScore.ts';
import { graphScoreMax, pickGraphs } from './utils/pickGraphs.ts';

interface GetGraphItemsParams {
  readonly thisWeek: WeekData;
  readonly recentDates: readonly Date[];
  readonly now: Date;
}

export function getGraphItems(
  { thisWeek, recentDates, now }: GetGraphItemsParams,
): PulseGraphItem[] {
  const locale = getLocale();
  const twAll = [...thisWeek.movieDates, ...thisWeek.showDates];

  const graphData: PulseGraphData = {
    dailyBars: countByCalendarDay({ dates: twAll, now, locale }),
    weekTrend: {
      weeks: computeWeekTrend(recentDates, now),
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
  };

  const qualifiedGraphs = pickGraphs(graphData);
  return qualifiedGraphs.map((g) => ({
    type: 'graph',
    key: g.type,
    kind: g.type,
    data: graphData,
    score: normalizeScore(g.score, graphScoreMax),
  }));
}
