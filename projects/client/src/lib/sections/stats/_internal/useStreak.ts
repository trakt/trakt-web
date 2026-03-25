import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { map, shareReplay } from 'rxjs';

export type StreakState = 'active' | 'at_risk' | 'none';

type StreakResult = {
  readonly count: number;
  readonly state: StreakState;
};

const emptyStreak: StreakResult = {
  count: 0,
  state: 'none',
};

export function computeStreak(
  watchedDates: ReadonlyArray<Date>,
  now: Date,
): StreakResult {
  if (watchedDates.length === 0) {
    return emptyStreak;
  }

  const daysWithActivity = new Set(watchedDates.map(getDayKey));

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const yesterday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );

  const hasActivityToday = daysWithActivity.has(getDayKey(today));
  const hasActivityYesterday = daysWithActivity.has(getDayKey(yesterday));

  if (!hasActivityToday && !hasActivityYesterday) {
    return emptyStreak;
  }

  const startDate = hasActivityToday ? today : yesterday;

  const sortedDays = [...daysWithActivity].sort().reverse();
  const previousDays = sortedDays.slice(
    sortedDays.indexOf(getDayKey(startDate)),
  );

  const breakIndex = previousDays.findIndex((day, i) => {
    const expected = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() - i,
    );
    return day !== getDayKey(expected);
  });

  const streakCount = breakIndex === -1 ? previousDays.length : breakIndex;

  return {
    count: streakCount,
    state: hasActivityToday ? 'active' : 'at_risk',
  };
}

export function useStreak() {
  const { history } = useUser();

  const now = new Date();

  const streak = history.pipe(
    map(($history) => {
      if (!$history) return null;

      const watchedDates = [
        ...[...$history.movies.values()].flatMap((m) => m.watchedDates),
        ...[...$history.shows.values()].flatMap((s) => s.watchedDates),
      ];

      return computeStreak(watchedDates, now);
    }),
    shareReplay(1),
  );

  return {
    streakCount: streak.pipe(map(($s) => $s?.count ?? 0)),
    streakState: streak.pipe(map(($s) => $s?.state ?? 'none' as StreakState)),
    isLoading: streak.pipe(map(($s) => $s === null)),
  };
}
