import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { combineLatest, map, shareReplay } from 'rxjs';
import { useActivityHistory } from './useActivityHistory.ts';

export type StreakState = 'active' | 'at_risk' | 'none';

type StreakResult = {
  readonly count: number;
  readonly state: StreakState;
};

type UseStreakProps = {
  readonly slug: string;
};

export function computeStreak(
  watchedDates: ReadonlyArray<Date>,
  now: Date,
): StreakResult {
  if (watchedDates.length === 0) {
    return { count: 0, state: 'none' };
  }

  const daysWithActivity = new Set(watchedDates.map(getDayKey));

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const hasActivityToday = daysWithActivity.has(getDayKey(today));

  let startDate: Date;
  if (!hasActivityToday) {
    const yesterday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1,
    );

    if (!daysWithActivity.has(getDayKey(yesterday))) {
      return { count: 0, state: 'none' };
    }

    startDate = yesterday;
  } else {
    startDate = today;
  }

  let streakCount = 0;
  let checkDate = new Date(startDate);
  for (let i = 0; i < daysWithActivity.size; i++) {
    if (!daysWithActivity.has(getDayKey(checkDate))) break;
    streakCount++;
    checkDate = new Date(
      checkDate.getFullYear(),
      checkDate.getMonth(),
      checkDate.getDate() - 1,
    );
  }

  return {
    count: streakCount,
    state: hasActivityToday ? 'active' : 'at_risk',
  };
}

export function useStreak({ slug }: UseStreakProps) {
  const { movies, shows, isLoadingMovies, isLoadingShows } = useActivityHistory(
    slug,
  );

  const now = new Date();

  const streak = combineLatest([movies, shows]).pipe(
    map(([$movies, $shows]) => {
      const allDates = [
        ...$movies.map((m) => m.watchedAt),
        ...$shows.map((s) => s.watchedAt),
      ];
      return computeStreak(allDates, now);
    }),
    shareReplay(1),
  );

  return {
    streakCount: streak.pipe(map(($s) => $s.count)),
    streakState: streak.pipe(map(($s) => $s.state)),
    isLoading: combineLatest([isLoadingMovies, isLoadingShows]).pipe(
      map(([$m, $s]) => $m || $s),
    ),
  };
}
