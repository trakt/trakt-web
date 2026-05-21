import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { EpisodeActivityHistory } from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { movieActivityHistoryQuery } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { showActivityHistoryQuery } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { WAKING_HOURS_PER_DAY } from '$lib/sections/stats/_internal/constants/index.ts';
import { addDays } from '$lib/utils/date/addDays.ts';
import { getStartOfDay } from '$lib/utils/date/getStartOfDay.ts';
import { subtractDays } from '$lib/utils/date/subtractDays.ts';
import { combineLatest, map, type Observable, shareReplay } from 'rxjs';
import { getGraphItems } from './getGraphItems.ts';
import { getSectionPriority } from './getSectionPriority.ts';
import { getStatItems } from './getStatItems.ts';
import type { DateRange } from './models/DateRange.ts';
import type { PulseItem } from './models/PulseItem.ts';
import type { WeekData } from './models/WeekData.ts';
import {
  computeDailyMinutes,
  computeTotalMinutes,
} from './utils/computeScreenTime.ts';

const historyLimit = 500;

function filterByRange(
  entries: ReadonlyArray<MovieActivityHistory | EpisodeActivityHistory>,
  range: DateRange,
): Array<MovieActivityHistory | EpisodeActivityHistory> {
  return entries.filter(
    (e) => e.watchedAt >= range.start && e.watchedAt < range.end,
  );
}

function countUniqueShows(
  shows: ReadonlyArray<EpisodeActivityHistory>,
): number {
  return new Set(shows.map((e) => e.show.id)).size;
}

function getRatingsInRange(
  data: UserRatings,
  range: DateRange,
): ReadonlyArray<{ readonly rating: number }> {
  return [
    ...data.movies.values(),
    ...data.shows.values(),
    ...data.episodes.values(),
  ].filter((e) => e.ratedAt >= range.start && e.ratedAt < range.end);
}

function buildWeekData(
  movies: ReadonlyArray<MovieActivityHistory>,
  shows: ReadonlyArray<EpisodeActivityHistory>,
  ratings: ReadonlyArray<{ readonly rating: number }>,
  now: Date,
): WeekData {
  const all = [...movies, ...shows];
  return {
    movieDates: movies.map((e) => e.watchedAt),
    showDates: shows.map((e) => e.watchedAt),
    uniqueShows: countUniqueShows(shows),
    ratings,
    totalMinutes: computeTotalMinutes(all),
    dailyMinutes: computeDailyMinutes(all, now),
  };
}

export function useWeeklyPulse({ mode }: { mode: DiscoverMode }): {
  items: Observable<PulseItem[]>;
  isLoading: Observable<boolean>;
  dateRange: DateRange;
} {
  const { ratings } = useUser();

  const now = new Date();
  const today = getStartOfDay(now);
  const tomorrow = addDays(today, 1);

  const thisWeekRange: DateRange = {
    start: subtractDays(today, 6),
    end: tomorrow,
  };
  const lastWeekRange: DateRange = {
    start: subtractDays(today, 13),
    end: thisWeekRange.start,
  };
  const twoWeekRange: DateRange = {
    start: lastWeekRange.start,
    end: tomorrow,
  };

  const displayRange: DateRange = {
    start: thisWeekRange.start,
    end: now,
  };

  const queryParams = {
    limit: historyLimit,
    slug: 'me' as const,
    startDate: twoWeekRange.start,
    endDate: twoWeekRange.end,
  };

  const { list: movieList, isLoading: isLoadingMovies } = usePaginatedListQuery(
    movieActivityHistoryQuery(queryParams),
  );
  const { list: showList, isLoading: isLoadingShows } = usePaginatedListQuery(
    showActivityHistoryQuery(queryParams),
  );

  const items = combineLatest([movieList, showList, ratings]).pipe(
    map(([$movies, $shows, $ratings]) => {
      const movies = mode !== 'show' ? $movies : [];
      const shows = mode !== 'movie' ? $shows : [];

      const twMovies = filterByRange(
        movies,
        thisWeekRange,
      ) as MovieActivityHistory[];
      const lwMovies = filterByRange(
        movies,
        lastWeekRange,
      ) as MovieActivityHistory[];
      const twShows = filterByRange(
        shows,
        thisWeekRange,
      ) as EpisodeActivityHistory[];
      const lwShows = filterByRange(
        shows,
        lastWeekRange,
      ) as EpisodeActivityHistory[];

      const twRatings = $ratings
        ? getRatingsInRange($ratings, thisWeekRange)
        : [];
      const lwRatings = $ratings
        ? getRatingsInRange($ratings, lastWeekRange)
        : [];

      const thisWeek = buildWeekData(twMovies, twShows, twRatings, now);
      const lastWeek = buildWeekData(
        lwMovies,
        lwShows,
        lwRatings,
        subtractDays(now, 7),
      );

      const statItems = getStatItems({ thisWeek, lastWeek, mode });

      const graphItems = getGraphItems({
        thisWeek,
        now,
        wakingHoursPerDay: WAKING_HOURS_PER_DAY,
      });

      const merged = [...statItems, ...graphItems];
      return merged
        .map((entry, index) => ({
          entry,
          index,
          priority: getSectionPriority(entry),
        }))
        .sort((a, b) => a.priority - b.priority || a.index - b.index)
        .map((x) => x.entry);
    }),
    shareReplay(1),
  );

  const isLoading = combineLatest([isLoadingMovies, isLoadingShows]).pipe(
    map((states) => states.some(Boolean)),
  );

  return { items, isLoading, dateRange: displayRange };
}
