import {
  movieActivityHistoryQuery,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import {
  showActivityHistoryQuery,
} from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { combineLatest, map } from 'rxjs';
import { usePaginatedListQuery } from '../../lists/stores/usePaginatedListQuery.ts';

// Uses two separate queries (matching useMonthToDate pattern) rather than the
// combined activityHistoryQuery, since useMonthToDate already establishes this
// pattern and the queries may already be cached from other components.

export type StreakState = 'active' | 'broken' | 'none';

type StreakResult = {
  count: number;
  state: StreakState;
};

const STREAK_HISTORY_LIMIT = 1000;

type UseStreakProps = {
  slug: string;
};

function computeStreak(
  watchedDates: Date[],
): StreakResult {
  if (watchedDates.length === 0) {
    return { count: 0, state: 'none' };
  }

  // Collect unique calendar days (local time) with watch activity
  const daysWithActivity = new Set<string>();
  for (const date of watchedDates) {
    const dayKey =
      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    daysWithActivity.add(dayKey);
  }

  // Walk backwards from today counting consecutive days (local time)
  const now = new Date();
  let currentDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const todayKey =
    `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
  const hasActivityToday = daysWithActivity.has(todayKey);

  if (!hasActivityToday) {
    // Check if there was activity yesterday (broken streak)
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey =
      `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

    if (!daysWithActivity.has(yesterdayKey)) {
      return { count: 0, state: 'none' };
    }

    // Walk backwards from yesterday to count the broken streak
    currentDate = yesterday;
  }

  let streakCount = 0;
  while (true) {
    const dayKey =
      `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;

    if (!daysWithActivity.has(dayKey)) {
      break;
    }

    streakCount++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return {
    count: streakCount,
    state: hasActivityToday ? 'active' : 'broken',
  };
}

export function useStreak({ slug }: UseStreakProps) {
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
    limit: STREAK_HISTORY_LIMIT,
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

  const streak = combineLatest([movies, shows]).pipe(
    map(([$movies, $shows]) => {
      const allDates = [
        ...$movies.map((m) => m.watchedAt),
        ...$shows.map((s) => s.watchedAt),
      ];
      return computeStreak(allDates);
    }),
  );

  return {
    streakCount: streak.pipe(map(($s) => $s.count)),
    streakState: streak.pipe(map(($s) => $s.state)),
    isLoading: combineLatest([isLoadingMovies, isLoadingShows]).pipe(
      map(([$m, $s]) => $m || $s),
    ),
  };
}
