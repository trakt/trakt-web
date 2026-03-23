import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { toHumanDayOfWeek } from '$lib/utils/formatting/date/toHumanDayOfWeek.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import { useActivityHistory } from './activityHistoryParams.ts';
import {
  bucketByTimeOfDay,
  computeRatingsDistribution,
  computeWeekTrend,
  countByCalendarDay,
  daysInWeek,
  graphScoreMax,
  pickGraphs,
  type PulseGraphData,
} from './pulseGraphs.ts';
import {
  interleaveByScore,
  normalizeScore,
  type PulseGraphItem,
  type PulseItem,
  type PulseStatItem,
} from './pulseItem.ts';
import { useUserComments } from './useUserComments.ts';
import { useUserRatings } from './useUserRatings.ts';
import {
  computeDelta,
  countUniqueDays,
  dayOfWeekDate,
  getBusiestDay,
  maxPlaysInSingleDay,
  rankStats,
  scoreStatWithContext,
  statScoreMax,
  sumHours,
  type PulseStat,
} from './pulseStats.ts';

export type { PulseItem, PulseStatItem, PulseGraphItem } from './pulseItem.ts';

type UseWeeklyPulseProps = {
  readonly slug: string;
};

type DateRange = { readonly start: Date; readonly end: Date };

const thisWeekStart = daysInWeek - 1;
const lastWeekStart = daysInWeek * 2 - 1;
const lastWeekEnd = daysInWeek;
const fourWeekLookback = daysInWeek * 4 - 1;

function getDateRange(
  { startDaysAgo, endDaysAgo, now }: { startDaysAgo: number; endDaysAgo: number; now: Date },
): DateRange {
  return {
    start: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - startDaysAgo,
    ),
    end: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - endDaysAgo + 1,
    ),
  };
}

function filterEntries<T extends { watchedAt: Date }>(
  entries: ReadonlyArray<T>,
  range: DateRange,
): T[] {
  return entries.filter((e) =>
    e.watchedAt >= range.start && e.watchedAt < range.end
  );
}

function fmt(n: number): string {
  return toHumanNumber(n, languageTag());
}

export function useWeeklyPulse({ slug }: UseWeeklyPulseProps): {
  items: Observable<readonly PulseItem[]>;
  isLoading: Observable<boolean>;
} {
  const { movies, shows, isLoadingMovies, isLoadingShows } =
    useActivityHistory(slug);
  const { ratings: ratingsEntries, isLoadingRatings } = useUserRatings();
  const { comments: commentsEntries, isLoadingComments } = useUserComments(slug);

  const now = new Date();
  const locale = getLocale();

  const thisWeekRange = getDateRange({ startDaysAgo: thisWeekStart, endDaysAgo: 0, now });
  const lastWeekRange = getDateRange({ startDaysAgo: lastWeekStart, endDaysAgo: lastWeekEnd, now });

  const items = combineLatest([movies, shows, ratingsEntries, commentsEntries]).pipe(
    map(([$movies, $shows, $ratings, $comments]) => {
      const twMovies = filterEntries($movies, thisWeekRange);
      const lwMovies = filterEntries($movies, lastWeekRange);
      const twShows = filterEntries($shows, thisWeekRange);
      const lwShows = filterEntries($shows, lastWeekRange);

      const twAllDates = [
        ...twMovies.map((e) => e.watchedAt),
        ...twShows.map((e) => e.watchedAt),
      ];
      const lwAllDates = [
        ...lwMovies.map((e) => e.watchedAt),
        ...lwShows.map((e) => e.watchedAt),
      ];

      const twShowSlugs = new Set(twShows.map((s) => s.show.slug));
      const lwShowSlugs = new Set(lwShows.map((s) => s.show.slug));

      const twBusiest = getBusiestDay(twAllDates);
      const lwBusiest = getBusiestDay(lwAllDates);

      const twHours = sumHours(twMovies, twShows);
      const lwHours = sumHours(lwMovies, lwShows);

      const twBingeMax = maxPlaysInSingleDay(twAllDates);
      const lwBingeMax = maxPlaysInSingleDay(lwAllDates);

      const busiestValue = twBusiest
        ? toHumanDayOfWeek(dayOfWeekDate(twBusiest.dayIndex, now), locale)
        : '—';

      const busiestNote = lwBusiest
        ? m.text_stats_was_last_week({
            day: toHumanDayOfWeek(
              dayOfWeekDate(lwBusiest.dayIndex, now),
              locale,
            ),
          })
        : undefined;

      const candidates: PulseStat[] = [
        {
          key: 'totalPlays',
          value: fmt(twAllDates.length),
          label: m.label_stats_plays(),
          tooltip: m.tooltip_stats_plays(),
          delta: computeDelta(twAllDates.length, lwAllDates.length),
        },
        {
          key: 'episodes',
          value: fmt(twShows.length),
          label: m.label_stats_episodes(),
          tooltip: m.tooltip_stats_episodes(),
          delta: computeDelta(twShows.length, lwShows.length),
        },
        {
          key: 'movies',
          value: fmt(twMovies.length),
          label: m.label_stats_movies(),
          tooltip: m.tooltip_stats_movies(),
          delta: computeDelta(twMovies.length, lwMovies.length),
        },
        {
          key: 'shows',
          value: fmt(twShowSlugs.size),
          label: m.label_stats_shows(),
          tooltip: m.tooltip_stats_shows(),
          delta: computeDelta(twShowSlugs.size, lwShowSlugs.size),
        },
        {
          key: 'activeDays',
          value: fmt(countUniqueDays(twAllDates)),
          label: m.label_stats_active_days(),
          tooltip: m.tooltip_stats_active_days(),
          delta: computeDelta(
            countUniqueDays(twAllDates),
            countUniqueDays(lwAllDates),
          ),
        },
        {
          key: 'busiestDay',
          value: busiestValue,
          label: m.label_stats_busiest_day(),
          tooltip: m.tooltip_stats_busiest_day(),
          delta: null,
          note: busiestNote,
        },
        {
          key: 'longestBinge',
          value: fmt(twBingeMax),
          label: m.label_stats_best_day(),
          tooltip: m.tooltip_stats_best_day(),
          delta: computeDelta(twBingeMax, lwBingeMax),
        },
        {
          key: 'hours',
          value: fmt(twHours),
          label: m.label_stats_hours(),
          tooltip: m.tooltip_stats_hours(),
          delta: computeDelta(twHours, lwHours),
        },
      ];

      const twRatings = $ratings.filter(r => r.ratedAt >= thisWeekRange.start && r.ratedAt < thisWeekRange.end);
      const lwRatings = $ratings.filter(r => r.ratedAt >= lastWeekRange.start && r.ratedAt < lastWeekRange.end);
      const twComments = $comments.filter(c => c.createdAt >= thisWeekRange.start && c.createdAt < thisWeekRange.end);
      const lwComments = $comments.filter(c => c.createdAt >= lastWeekRange.start && c.createdAt < lastWeekRange.end);

      if (twRatings.length > 0 || lwRatings.length > 0) {
        candidates.push({
          key: 'ratings',
          value: fmt(twRatings.length),
          label: m.label_stats_ratings(),
          tooltip: m.tooltip_stats_ratings(),
          delta: computeDelta(twRatings.length, lwRatings.length),
        });
      }
      if (twComments.length > 0 || lwComments.length > 0) {
        candidates.push({
          key: 'comments',
          value: fmt(twComments.length),
          label: m.label_stats_comments(),
          tooltip: m.tooltip_stats_comments(),
          delta: computeDelta(twComments.length, lwComments.length),
        });
      }

      // Score and rank stats — redundant stats get deprioritized, not removed
      const rawCounts = new Map<string, number>([
        ['totalPlays', twAllDates.length],
        ['episodes', twShows.length],
        ['movies', twMovies.length],
      ]);

      const rankedStats = rankStats(candidates, rawCounts);
      const statItems: PulseStatItem[] = rankedStats.map((stat) => ({
        type: 'stat',
        ...stat,
        score: normalizeScore(scoreStatWithContext(stat, rawCounts), statScoreMax),
      }));

      // Build graph data and score graphs
      const fourWeekRange = getDateRange({ startDaysAgo: fourWeekLookback, endDaysAgo: 0, now });
      const allRecentDates = [
        ...filterEntries($movies, fourWeekRange).map((e) => e.watchedAt),
        ...filterEntries($shows, fourWeekRange).map((e) => e.watchedAt),
      ];

      const twRatingScores = twRatings.map(r => r.score);

      const graphData: PulseGraphData = {
        dailyBars: countByCalendarDay({ dates: twAllDates, now, locale }),
        weekTrend: {
          weeks: computeWeekTrend(allRecentDates, now),
        },
        watchClock: {
          buckets: bucketByTimeOfDay(twAllDates),
        },
        showsMovies: {
          episodes: twShows.length,
          movies: twMovies.length,
        },
        ratingsDistribution: computeRatingsDistribution(twRatingScores),
      };

      const qualifiedGraphs = pickGraphs(graphData);
      const graphItems: PulseGraphItem[] = qualifiedGraphs.map((g) => ({
        type: 'graph',
        key: g.type,
        kind: g.type,
        data: graphData,
        score: normalizeScore(g.score, graphScoreMax),
      }));

      return interleaveByScore(statItems, graphItems);
    }),
  );

  const isLoading = combineLatest([
    isLoadingMovies, isLoadingShows, isLoadingRatings, isLoadingComments,
  ]).pipe(map((states) => states.some(Boolean)));

  return { items, isLoading };
}
