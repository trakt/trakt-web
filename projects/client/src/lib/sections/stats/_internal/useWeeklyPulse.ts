import type { UserHistory } from '$lib/features/auth/queries/currentUserHistoryQuery.ts';
import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';

import { addDays } from '$lib/utils/date/addDays.ts';
import { getStartOfDay } from '$lib/utils/date/getStartOfDay.ts';
import { subtractDays } from '$lib/utils/date/subtractDays.ts';
import { combineLatest, map, type Observable, shareReplay } from 'rxjs';
import { getGraphItems } from './getGraphItems.ts';
import { getStatItems } from './getStatItems.ts';
import type { DateRange } from './models/DateRange.ts';
import type { PulseItem } from './models/PulseItem.ts';
import { interleaveByScore } from './utils/interleaveByScore.ts';

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

export function useWeeklyPulse(): {
  items: Observable<PulseItem[]>;
  isLoading: Observable<boolean>;
  dateRange: DateRange;
} {
  const { history, ratings } = useUser();

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

  const displayRange: DateRange = {
    start: thisWeekRange.start,
    end: now,
  };

  const items = combineLatest([history, ratings]).pipe(
    map(([$history, $ratings]) => {
      if (!$history || !$ratings) return [];

      const { movieDates, showDates, showIds } = extractDates($history);

      const twMovieDates = filterDates(movieDates, thisWeekRange);
      const lwMovieDates = filterDates(movieDates, lastWeekRange);
      const twShowDates = filterDates(showDates, thisWeekRange);
      const lwShowDates = filterDates(showDates, lastWeekRange);

      const thisWeek = {
        movieDates: twMovieDates,
        showDates: twShowDates,
        uniqueShows: countShowsInRange(showIds, thisWeekRange),
        ratings: getRatingsInRange($ratings, thisWeekRange),
      };

      const lastWeek = {
        movieDates: lwMovieDates,
        showDates: lwShowDates,
        uniqueShows: countShowsInRange(showIds, lastWeekRange),
        ratings: getRatingsInRange($ratings, lastWeekRange),
      };

      const statItems = getStatItems({ thisWeek, lastWeek, now });

      const fourWeekRange: DateRange = {
        start: subtractDays(today, 27),
        end: tomorrow,
      };

      const graphItems = getGraphItems({
        thisWeek,
        recentDates: [
          ...filterDates(movieDates, fourWeekRange),
          ...filterDates(showDates, fourWeekRange),
        ],
        now,
      });

      return interleaveByScore(statItems, graphItems);
    }),
    shareReplay(1),
  );

  const isLoading = combineLatest([
    history.pipe(map(($history) => !$history)),
    ratings.pipe(map(($ratings) => !$ratings)),
  ]).pipe(map((states) => states.some(Boolean)));

  return { items, isLoading, dateRange: displayRange };
}
