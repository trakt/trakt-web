import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { UserHistory } from '$lib/features/auth/queries/currentUserHistoryQuery.ts';
import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { toHumanDayOfWeek } from '$lib/utils/formatting/date/toHumanDayOfWeek.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';
import { combineLatest, map, type Observable } from 'rxjs';
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
  type PulseStat,
  rankStats,
  scoreStatWithContext,
  statScoreMax,
} from './pulseStats.ts';

export type { PulseGraphItem, PulseItem, PulseStatItem } from './pulseItem.ts';

type UseWeeklyPulseProps = {
  readonly slug: string;
};

type DateRange = { readonly start: Date; readonly end: Date };

const thisWeekStart = daysInWeek - 1;
const lastWeekStart = daysInWeek * 2 - 1;
const lastWeekEnd = daysInWeek;
const fourWeekLookback = daysInWeek * 4 - 1;

function getDateRange(
  { startDaysAgo, endDaysAgo, now }: {
    startDaysAgo: number;
    endDaysAgo: number;
    now: Date;
  },
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

function filterDates(
  dates: ReadonlyArray<Date>,
  range: DateRange,
): Date[] {
  return dates.filter((d) => d >= range.start && d < range.end);
}

function extractDates(history: UserHistory): {
  readonly movieDates: readonly Date[];
  readonly showDates: readonly Date[];
  readonly showIds: ReadonlyMap<number, readonly Date[]>;
} {
  const movieDates = [...history.movies.values()].flatMap((m) =>
    m.watchedDates
  );
  const showIds = new Map<number, readonly Date[]>();
  const showDates: Date[] = [];

  for (const show of history.shows.values()) {
    showIds.set(show.id, show.watchedDates);
    showDates.push(...show.watchedDates);
  }

  return { movieDates, showDates, showIds };
}

function countShowsInRange(
  showIds: ReadonlyMap<number, readonly Date[]>,
  range: DateRange,
): number {
  let count = 0;
  for (const dates of showIds.values()) {
    if (dates.some((d) => d >= range.start && d < range.end)) count++;
  }
  return count;
}

function fmt(n: number): string {
  return toHumanNumber(n, languageTag());
}

export function useWeeklyPulse({ slug }: UseWeeklyPulseProps): {
  items: Observable<readonly PulseItem[]>;
  isLoading: Observable<boolean>;
} {
  const { history } = useUser();
  const { ratings: ratingsEntries, isLoadingRatings } = useUserRatings();
  const { comments: commentsEntries, isLoadingComments } = useUserComments(
    slug,
  );

  const now = new Date();
  const locale = getLocale();

  const thisWeekRange = getDateRange({
    startDaysAgo: thisWeekStart,
    endDaysAgo: 0,
    now,
  });
  const lastWeekRange = getDateRange({
    startDaysAgo: lastWeekStart,
    endDaysAgo: lastWeekEnd,
    now,
  });

  const items = combineLatest([history, ratingsEntries, commentsEntries]).pipe(
    map(([$history, $ratings, $comments]) => {
      if (!$history) return [];

      const { movieDates, showDates, showIds } = extractDates($history);

      const twMovieDates = filterDates(movieDates, thisWeekRange);
      const lwMovieDates = filterDates(movieDates, lastWeekRange);
      const twShowDates = filterDates(showDates, thisWeekRange);
      const lwShowDates = filterDates(showDates, lastWeekRange);

      const twAllDates = [...twMovieDates, ...twShowDates];
      const lwAllDates = [...lwMovieDates, ...lwShowDates];

      const twUniqueShows = countShowsInRange(showIds, thisWeekRange);
      const lwUniqueShows = countShowsInRange(showIds, lastWeekRange);

      const twBusiest = getBusiestDay(twAllDates);
      const lwBusiest = getBusiestDay(lwAllDates);

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

      const twActiveDays = countUniqueDays(twAllDates);

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
          value: fmt(twShowDates.length),
          label: m.label_stats_episodes(),
          tooltip: m.tooltip_stats_episodes(),
          delta: computeDelta(twShowDates.length, lwShowDates.length),
        },
        {
          key: 'movies',
          value: fmt(twMovieDates.length),
          label: m.label_stats_movies(),
          tooltip: m.tooltip_stats_movies(),
          delta: computeDelta(twMovieDates.length, lwMovieDates.length),
        },
        {
          key: 'shows',
          value: fmt(twUniqueShows),
          label: m.label_stats_shows(),
          tooltip: m.tooltip_stats_shows(),
          delta: computeDelta(twUniqueShows, lwUniqueShows),
        },
        {
          key: 'activeDays',
          value: fmt(twActiveDays),
          label: m.label_stats_active_days(),
          tooltip: m.tooltip_stats_active_days(),
          delta: computeDelta(
            twActiveDays,
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
        // TODO: hours stat needs runtime data not available from useUser().history.
        // Requires a dedicated endpoint or extending the history query with runtime info.
        // {
        //   key: 'hours',
        //   value: fmt(hours),
        //   label: m.label_stats_hours(),
        //   tooltip: m.tooltip_stats_hours(),
        //   delta: computeDelta(twHours, lwHours),
        // },
      ];

      const twRatings = $ratings.filter((r) =>
        r.ratedAt >= thisWeekRange.start && r.ratedAt < thisWeekRange.end
      );
      const lwRatings = $ratings.filter((r) =>
        r.ratedAt >= lastWeekRange.start && r.ratedAt < lastWeekRange.end
      );
      const twComments = $comments.filter((c) =>
        c.createdAt >= thisWeekRange.start && c.createdAt < thisWeekRange.end
      );
      const lwComments = $comments.filter((c) =>
        c.createdAt >= lastWeekRange.start && c.createdAt < lastWeekRange.end
      );

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

      const rawCounts = new Map<string, number>([
        ['totalPlays', twAllDates.length],
        ['episodes', twShowDates.length],
        ['movies', twMovieDates.length],
      ]);

      const rankedStats = rankStats(candidates, rawCounts);
      const statItems: PulseStatItem[] = rankedStats.map((stat) => ({
        type: 'stat',
        ...stat,
        score: normalizeScore(
          scoreStatWithContext(stat, rawCounts),
          statScoreMax,
        ),
      }));

      const fourWeekRange = getDateRange({
        startDaysAgo: fourWeekLookback,
        endDaysAgo: 0,
        now,
      });
      const allRecentDates = [
        ...filterDates(movieDates, fourWeekRange),
        ...filterDates(showDates, fourWeekRange),
      ];

      const twRatingScores = twRatings.map((r) => r.score);

      const graphData: PulseGraphData = {
        dailyBars: countByCalendarDay({ dates: twAllDates, now, locale }),
        weekTrend: {
          weeks: computeWeekTrend(allRecentDates, now),
        },
        watchClock: {
          buckets: bucketByTimeOfDay(twAllDates),
        },
        showsMovies: {
          episodes: twShowDates.length,
          movies: twMovieDates.length,
        },
        ratingsDistribution: computeRatingsDistribution(twRatingScores),
      };

      const qualifiedGraphs = pickGraphs(graphData);
      const graphSpan = 2;
      const graphItems: PulseGraphItem[] = qualifiedGraphs.map((g) => ({
        type: 'graph',
        key: g.type,
        kind: g.type,
        data: graphData,
        score: normalizeScore(g.score, graphScoreMax),
        span: graphSpan,
      }));

      return interleaveByScore(statItems, graphItems);
    }),
  );

  const isLoading = combineLatest([
    history.pipe(map(($h) => !$h)),
    isLoadingRatings,
    isLoadingComments,
  ]).pipe(map((states) => states.some(Boolean)));

  return { items, isLoading };
}
