import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import {
  movieActivityHistoryQuery,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import type { ShowActivityHistory } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import {
  showActivityHistoryQuery,
} from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { useMonthInReview } from '$lib/sections/banner/month-in-review/_internal/useMonthInReview.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import { usePaginatedListQuery } from '../../lists/stores/usePaginatedListQuery.ts';

export type PulseStat = {
  key: string;
  value: string;
  label: string;
  delta: number | null;
  note?: string;
};

export type PulseGraphType =
  | 'dailyBars'
  | 'weekTrend'
  | 'watchClock'
  | 'showsMovies'
  | 'bingeTimeline';

export type PulseGraphData = {
  dailyBars: {
    thisWeek: number[];
    lastWeek: number[];
    dayLabels: string[];
    todayIndex: number;
  };
  weekTrend: {
    weeks: { label: string; plays: number }[];
  };
  watchClock: {
    buckets: { label: string; count: number }[];
  };
  showsMovies: {
    episodes: number;
    movies: number;
  };
  bingeTimeline: {
    days: { label: string; count: number }[];
    maxCount: number;
  };
};

type UseWeeklyPulseProps = {
  slug: string;
};

type DateRange = { start: Date; end: Date };

const HISTORY_LIMIT = 1000;

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function getDateRange(startDaysAgo: number, endDaysAgo: number): DateRange {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - startDaysAgo),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate() - endDaysAgo + 1),
  };
}

function filterEntries<T extends { watchedAt: Date }>(
  entries: T[],
  range: DateRange,
): T[] {
  return entries.filter((e) => e.watchedAt >= range.start && e.watchedAt < range.end);
}

function sumHours(
  movieEntries: MovieActivityHistory[],
  showEntries: ShowActivityHistory[],
): number {
  let totalMinutes = 0;
  for (const m of movieEntries) {
    totalMinutes += m.movie.runtime;
  }
  for (const s of showEntries) {
    totalMinutes += s.episode.runtime;
  }
  return Math.round(totalMinutes / 60);
}

function countUniqueDays(dates: Date[]): number {
  const days = new Set<string>();
  for (const d of dates) {
    days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }
  return days.size;
}

function getBusiestDay(dates: Date[]): { day: string; count: number } {
  if (dates.length === 0) return { day: '—', count: 0 };

  const counts = new Map<number, number>();
  for (const d of dates) {
    const dow = d.getDay();
    counts.set(dow, (counts.get(dow) ?? 0) + 1);
  }

  let maxDay = 0;
  let maxCount = 0;
  for (const [day, count] of counts) {
    if (count > maxCount) {
      maxDay = day;
      maxCount = count;
    }
  }

  return { day: DAY_NAMES[maxDay]!, count: maxCount };
}

function maxPlaysInSingleDay(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const counts = new Map<string, number>();
  for (const d of dates) {
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  let max = 0;
  for (const count of counts.values()) {
    if (count > max) max = count;
  }
  return max;
}

function fmt(n: number): string {
  return toHumanNumber(n, 'en');
}

function delta(thisWeek: number, lastWeek: number): number {
  return thisWeek - lastWeek;
}

function countByWeekday(dates: Date[]): number[] {
  const counts = Array(7).fill(0) as number[];
  for (const d of dates) {
    const dow = (d.getDay() + 6) % 7;
    counts[dow]++;
  }
  return counts;
}

function bucketByTimeOfDay(dates: Date[]): {
  label: string;
  count: number;
}[] {
  const buckets = [0, 0, 0, 0];
  for (const d of dates) {
    const h = d.getHours();
    if (h >= 5 && h < 12) buckets[0]++;
    else if (h >= 12 && h < 17) buckets[1]++;
    else if (h >= 17 && h < 22) buckets[2]++;
    else buckets[3]++;
  }
  return [
    { label: 'Morning', count: buckets[0]! },
    { label: 'Afternoon', count: buckets[1]! },
    { label: 'Evening', count: buckets[2]! },
    { label: 'Late Night', count: buckets[3]! },
  ];
}

function computeWeekTrend(dates: Date[]): { label: string; plays: number }[] {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const weeks: { label: string; plays: number }[] = [];
  const labels = ['4w ago', '3w', '2w', 'This week'];

  for (let i = 3; i >= 0; i--) {
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (i * 7 + 6),
    );
    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (i * 7) + 1,
    );
    const count = dates.filter((d) => d >= start && d < end).length;
    weeks.push({ label: labels[3 - i]!, plays: count });
  }

  return weeks;
}

function pickGraph(graphData: PulseGraphData): PulseGraphType | null {
  type Candidate = { type: PulseGraphType; score: number };
  const candidates: Candidate[] = [];

  // dailyBars: compelling if 3+ active days (shows a rhythm)
  const activeDays = graphData.dailyBars.thisWeek.filter((c) => c > 0).length;
  if (activeDays >= 3) {
    candidates.push({ type: 'dailyBars', score: activeDays });
  }

  // weekTrend: compelling if meaningful variance across 4 weeks
  const weekPlays = graphData.weekTrend.weeks.map((w) => w.plays);
  const maxWeek = Math.max(...weekPlays);
  const minWeek = Math.min(...weekPlays);
  if (maxWeek > 0 && (maxWeek - minWeek) / maxWeek > 0.25) {
    candidates.push({ type: 'weekTrend', score: (maxWeek - minWeek) / maxWeek * 10 });
  }

  // watchClock: compelling if a clear peak (one bucket > 40% of total)
  const clockTotal = graphData.watchClock.buckets.reduce((s, b) => s + b.count, 0);
  const clockPeak = Math.max(...graphData.watchClock.buckets.map((b) => b.count));
  if (clockTotal > 0 && clockPeak / clockTotal > 0.4) {
    candidates.push({ type: 'watchClock', score: clockPeak / clockTotal * 10 });
  }

  // showsMovies: only if both > 0
  const { episodes, movies: movieCount } = graphData.showsMovies;
  if (episodes > 0 && movieCount > 0) {
    const balance = Math.min(episodes, movieCount) / Math.max(episodes, movieCount);
    candidates.push({ type: 'showsMovies', score: balance * 10 });
  }

  // bingeTimeline: skip (redundant with dailyBars)

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]!.type;
}

function dedup(candidates: PulseStat[]): PulseStat[] {
  const byKey = new Map(candidates.map((c) => [c.key, c]));

  const plays = byKey.get('totalPlays');
  const episodes = byKey.get('episodes');
  const moviesItem = byKey.get('movies');

  // If plays == episodes (no movies), drop episodes
  if (plays && episodes && plays.value === episodes.value) {
    candidates = candidates.filter((c) => c.key !== 'episodes');
  }
  // If plays == movies (no episodes), drop movies
  if (plays && moviesItem && plays.value === moviesItem.value) {
    candidates = candidates.filter((c) => c.key !== 'movies');
  }
  // If movies == 0 and not already removed, drop
  if (moviesItem && moviesItem.value === '0' && moviesItem.delta === 0) {
    candidates = candidates.filter((c) => c.key !== 'movies');
  }

  return candidates;
}

export function useWeeklyPulse({ slug }: UseWeeklyPulseProps): {
  stats: Observable<PulseStat[]>;
  graphData: Observable<PulseGraphData>;
  selectedGraph: Observable<PulseGraphType | null>;
  isLoading: Observable<boolean>;
} {
  // Cache-aligned params — identical to useStreak.ts:88-117
  const now = new Date();
  const startDate = new Date(
    Date.UTC(
      now.getUTCFullYear() - 1,
      now.getUTCMonth(),
      now.getUTCDate(),
    ),
  );
  const endDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
    ),
  );

  const params = {
    limit: HISTORY_LIMIT,
    slug,
    startDate,
    endDate,
  };

  const { list: movies, isLoading: isLoadingMovies } = usePaginatedListQuery(
    movieActivityHistoryQuery(params),
  );
  const { list: shows, isLoading: isLoadingShows } = usePaginatedListQuery(
    showActivityHistoryQuery(params),
  );

  // Cache-aligned params — identical to StatChips.svelte:22-28
  const { review, isLoading: isLoadingReview } = useMonthInReview({
    slug,
    month: now.getUTCMonth() + 1,
    year: now.getUTCFullYear(),
  });

  const thisWeekRange = getDateRange(6, 0);
  const lastWeekRange = getDateRange(13, 7);

  const stats = combineLatest([movies, shows, review]).pipe(
    map(([$movies, $shows, $review]) => {
      const twMovies = filterEntries($movies, thisWeekRange);
      const lwMovies = filterEntries($movies, lastWeekRange);
      const twShows = filterEntries($shows, thisWeekRange);
      const lwShows = filterEntries($shows, lastWeekRange);

      const twAllDates = [
        ...twMovies.map((m) => m.watchedAt),
        ...twShows.map((s) => s.watchedAt),
      ];
      const lwAllDates = [
        ...lwMovies.map((m) => m.watchedAt),
        ...lwShows.map((s) => s.watchedAt),
      ];

      // Unique show slugs
      const twShowSlugs = new Set(twShows.map((s) => s.show.slug));
      const lwShowSlugs = new Set(lwShows.map((s) => s.show.slug));

      const twBusiest = getBusiestDay(twAllDates);
      const lwBusiest = getBusiestDay(lwAllDates);

      // Hours — derived from entry runtimes (with delta)
      const twHours = sumHours(twMovies, twShows);
      const lwHours = sumHours(lwMovies, lwShows);

      const twBingeMax = maxPlaysInSingleDay(twAllDates);
      const lwBingeMax = maxPlaysInSingleDay(lwAllDates);

      const candidates: PulseStat[] = [
        {
          key: 'totalPlays',
          value: fmt(twAllDates.length),
          label: 'Plays',
          delta: delta(twAllDates.length, lwAllDates.length),
        },
        {
          key: 'episodes',
          value: fmt(twShows.length),
          label: 'Episodes',
          delta: delta(twShows.length, lwShows.length),
        },
        {
          key: 'movies',
          value: fmt(twMovies.length),
          label: 'Movies',
          delta: delta(twMovies.length, lwMovies.length),
        },
        {
          key: 'shows',
          value: fmt(twShowSlugs.size),
          label: 'Shows',
          delta: delta(twShowSlugs.size, lwShowSlugs.size),
        },
        {
          key: 'activeDays',
          value: fmt(countUniqueDays(twAllDates)),
          label: 'Active Days',
          delta: delta(
            countUniqueDays(twAllDates),
            countUniqueDays(lwAllDates),
          ),
        },
        {
          key: 'busiestDay',
          value: twBusiest.day,
          label: 'Busiest Day',
          delta: null,
          note: lwBusiest.day !== '—'
            ? `was ${lwBusiest.day} last week`
            : undefined,
        },
        {
          key: 'longestBinge',
          value: fmt(twBingeMax),
          label: 'Best Day',
          delta: delta(twBingeMax, lwBingeMax),
        },
        {
          key: 'hours',
          value: fmt(twHours),
          label: 'Hours',
          delta: delta(twHours, lwHours),
        },
      ];

      // Month-in-review stats (no deltas — API lacks date range filtering)
      if ($review) {
        candidates.push(
          {
            key: 'ratings',
            value: fmt($review.ratingsCount),
            label: 'Ratings',
            delta: null,
          },
          {
            key: 'comments',
            value: fmt($review.commentsCount),
            label: 'Comments',
            delta: null,
          },
          {
            key: 'lists',
            value: fmt($review.listsCount),
            label: 'List Items',
            delta: null,
          },
        );
      }

      // Sort: abs(delta) descending, zero-value+zero-delta to back,
      // null-delta (month-in-review) after history stats
      const sorted = candidates.sort((a, b) => {
        const aIsZero = a.value === '0' && a.delta === 0;
        const bIsZero = b.value === '0' && b.delta === 0;
        if (aIsZero !== bIsZero) return aIsZero ? 1 : -1;

        const aIsNull = a.delta === null;
        const bIsNull = b.delta === null;
        if (aIsNull !== bIsNull) return aIsNull ? 1 : -1;

        return Math.abs(b.delta ?? 0) - Math.abs(a.delta ?? 0);
      });

      return dedup(sorted);
    }),
  );

  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const DAY_LABELS_FULL = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ];

  const graphData = combineLatest([movies, shows]).pipe(
    map(([$movies, $shows]) => {
      const twMovies = filterEntries($movies, thisWeekRange);
      const lwMovies = filterEntries($movies, lastWeekRange);
      const twShows = filterEntries($shows, thisWeekRange);
      const lwShows = filterEntries($shows, lastWeekRange);

      const twAllDates = [
        ...twMovies.map((m) => m.watchedAt),
        ...twShows.map((s) => s.watchedAt),
      ];
      const lwAllDates = [
        ...lwMovies.map((m) => m.watchedAt),
        ...lwShows.map((s) => s.watchedAt),
      ];

      // All dates for the last 4 weeks
      const fourWeekRange = getDateRange(27, 0);
      const allRecentMovieDates = filterEntries($movies, fourWeekRange)
        .map((m) => m.watchedAt);
      const allRecentShowDates = filterEntries($shows, fourWeekRange)
        .map((s) => s.watchedAt);
      const allRecentDates = [...allRecentMovieDates, ...allRecentShowDates];

      const todayDow = (new Date().getDay() + 6) % 7;

      const thisWeekByDay = countByWeekday(twAllDates);
      const lastWeekByDay = countByWeekday(lwAllDates);

      const bingeTimeline = thisWeekByDay.map((count, i) => ({
        label: DAY_LABELS_FULL[i]!,
        count,
      }));
      const maxCount = Math.max(...thisWeekByDay, 1);

      return {
        dailyBars: {
          thisWeek: thisWeekByDay,
          lastWeek: lastWeekByDay,
          dayLabels: DAY_LABELS,
          todayIndex: todayDow,
        },
        weekTrend: {
          weeks: computeWeekTrend(allRecentDates),
        },
        watchClock: {
          buckets: bucketByTimeOfDay(twAllDates),
        },
        showsMovies: {
          episodes: twShows.length,
          movies: twMovies.length,
        },
        bingeTimeline: {
          days: bingeTimeline,
          maxCount,
        },
      } satisfies PulseGraphData;
    }),
  );

  const selectedGraph = graphData.pipe(
    map(($graphData) => pickGraph($graphData)),
  );

  const isLoading = combineLatest([
    isLoadingMovies,
    isLoadingShows,
    isLoadingReview,
  ]).pipe(
    map(([$m, $s, $r]) => $m || $s || $r),
  );

  return { stats, graphData, selectedGraph, isLoading };
}
