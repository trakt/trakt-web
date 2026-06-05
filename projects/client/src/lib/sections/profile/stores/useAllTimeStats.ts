import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { chunkedReduce } from '$lib/utils/timing/chunkedReduce.ts';
import { from, map, Observable, of, shareReplay, startWith, switchMap } from 'rxjs';

export type AllTimeStats = {
  movieCount: number;
  showCount: number;
  episodeCount: number;
};

const emptyStats: AllTimeStats = {
  movieCount: 0,
  showCount: 0,
  episodeCount: 0,
};

type StatsState = {
  stats: AllTimeStats;
  isLoading: boolean;
};

const loadingState: StatsState = { stats: emptyStats, isLoading: true };

function sumEpisodes(shows: UserHistory['shows']): Promise<number> {
  return chunkedReduce(
    shows.values(),
    (sum, show) => sum + show.episodes.length,
    0,
  );
}

function computeStats(h: UserHistory): Observable<StatsState> {
  return from(sumEpisodes(h.shows)).pipe(
    map((episodeCount) => ({
      stats: {
        movieCount: h.movies.size,
        showCount: h.shows.size,
        episodeCount,
      },
      isLoading: false,
    })),
    startWith(loadingState),
  );
}

export function useAllTimeStats() {
  const { history } = useUser();

  const state = history.pipe(
    switchMap((h): Observable<StatsState> => {
      if (!h) return of(loadingState);
      return computeStats(h);
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  return {
    stats: state.pipe(map((s) => s.stats)),
    isLoading: state.pipe(map((s) => s.isLoading)),
  };
}
