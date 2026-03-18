import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { toHumanDayOfWeek } from '$lib/utils/formatting/date/toHumanDayOfWeek.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import { useActivityHistory } from './activityHistoryParams.ts';
import {
  bucketByTimeOfDay,
  computeWeekTrend,
  countByCalendarDay,
  pickGraph,
  type PulseGraphData,
  type PulseGraphType,
} from './pulseGraphs.ts';
import {
  computeDelta,
  countUniqueDays,
  dayOfWeekDate,
  dedup,
  getBusiestDay,
  maxPlaysInSingleDay,
  sumHours,
  type PulseStat,
} from './pulseStats.ts';

export type { PulseGraphData, PulseGraphType } from './pulseGraphs.ts';
export type { PulseStat } from './pulseStats.ts';

type UseWeeklyPulseProps = {
  readonly slug: string;
};

type DateRange = { readonly start: Date; readonly end: Date };

function getDateRange(startDaysAgo: number, endDaysAgo: number, now: Date): DateRange {
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
  stats: Observable<readonly PulseStat[]>;
  graphData: Observable<PulseGraphData>;
  selectedGraph: Observable<PulseGraphType | null>;
  isLoading: Observable<boolean>;
} {
  const { movies, shows, isLoadingMovies, isLoadingShows } =
    useActivityHistory(slug);

  const now = new Date();
  const locale = getLocale();

  const thisWeekRange = getDateRange(6, 0, now);
  const lastWeekRange = getDateRange(13, 7, now);

  const stats = combineLatest([movies, shows]).pipe(
    map(([$movies, $shows]) => {
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

      const rawCounts = new Map<string, number>([
        ['totalPlays', twAllDates.length],
        ['episodes', twShows.length],
        ['movies', twMovies.length],
      ]);

      const candidates: PulseStat[] = [
        {
          key: 'totalPlays',
          value: fmt(twAllDates.length),
          label: m.label_stats_plays(),
          delta: computeDelta(twAllDates.length, lwAllDates.length),
        },
        {
          key: 'episodes',
          value: fmt(twShows.length),
          label: m.label_stats_episodes(),
          delta: computeDelta(twShows.length, lwShows.length),
        },
        {
          key: 'movies',
          value: fmt(twMovies.length),
          label: m.label_stats_movies(),
          delta: computeDelta(twMovies.length, lwMovies.length),
        },
        {
          key: 'shows',
          value: fmt(twShowSlugs.size),
          label: m.label_stats_shows(),
          delta: computeDelta(twShowSlugs.size, lwShowSlugs.size),
        },
        {
          key: 'activeDays',
          value: fmt(countUniqueDays(twAllDates)),
          label: m.label_stats_active_days(),
          delta: computeDelta(
            countUniqueDays(twAllDates),
            countUniqueDays(lwAllDates),
          ),
        },
        {
          key: 'busiestDay',
          value: busiestValue,
          label: m.label_stats_busiest_day(),
          delta: null,
          note: busiestNote,
        },
        {
          key: 'longestBinge',
          value: fmt(twBingeMax),
          label: m.label_stats_best_day(),
          delta: computeDelta(twBingeMax, lwBingeMax),
        },
        {
          key: 'hours',
          value: fmt(twHours),
          label: m.label_stats_hours(),
          delta: computeDelta(twHours, lwHours),
        },
      ];

      const sorted = candidates.sort((a, b) => {
        const aIsZero = a.value === '0' && a.delta === 0;
        const bIsZero = b.value === '0' && b.delta === 0;
        if (aIsZero !== bIsZero) return aIsZero ? 1 : -1;

        const aIsNull = a.delta === null;
        const bIsNull = b.delta === null;
        if (aIsNull !== bIsNull) return aIsNull ? 1 : -1;

        return Math.abs(b.delta ?? 0) - Math.abs(a.delta ?? 0);
      });

      return dedup(sorted, rawCounts);
    }),
  );

  const graphData = combineLatest([movies, shows]).pipe(
    map(([$movies, $shows]) => {
      const twMovies = filterEntries($movies, thisWeekRange);
      const twShows = filterEntries($shows, thisWeekRange);

      const twAllDates = [
        ...twMovies.map((e) => e.watchedAt),
        ...twShows.map((e) => e.watchedAt),
      ];

      const fourWeekRange = getDateRange(27, 0, now);
      const allRecentDates = [
        ...filterEntries($movies, fourWeekRange).map((e) => e.watchedAt),
        ...filterEntries($shows, fourWeekRange).map((e) => e.watchedAt),
      ];

      return {
        dailyBars: countByCalendarDay(twAllDates, now, locale),
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
      } satisfies PulseGraphData;
    }),
  );

  const selectedGraph = graphData.pipe(
    map(($graphData) => pickGraph($graphData)),
  );

  const isLoading = combineLatest([isLoadingMovies, isLoadingShows]).pipe(
    map(([$m, $s]) => $m || $s),
  );

  return { stats, graphData, selectedGraph, isLoading };
}
