import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { map, shareReplay } from 'rxjs';
import { computeMonthlyStats } from './utils/computeMonthlyStats.ts';

type UseMonthlyStatsParams = {
  mode: DiscoverMode;
};

export function useMonthlyStats({ mode }: UseMonthlyStatsParams) {
  const { history } = useUser();
  const now = new Date();

  const stats = history.pipe(
    map(($history) => {
      if (!$history) return null;

      const movieDates = mode !== 'show'
        ? [...$history.movies.values()].flatMap((m) => m.watchedDates)
        : [];

      const showDates = mode !== 'movie'
        ? [...$history.shows.values()].flatMap((s) => s.watchedDates)
        : [];

      return computeMonthlyStats([...movieDates, ...showDates], now);
    }),
    shareReplay(1),
  );

  return {
    stats: stats.pipe(map((stats) => stats)),
    isLoading: stats.pipe(map((stats) => stats === null)),
  };
}
