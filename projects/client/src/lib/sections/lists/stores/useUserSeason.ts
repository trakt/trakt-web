import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { combineLatest, map, type Observable } from 'rxjs';

export const EMPTY_SEASON_INFO = { number: -1, episodes: { count: -1 } };

export function useUserSeason(showId$: Observable<number | Nil>) {
  const { isAuthorized } = useAuth();
  const { history } = useUser();

  return combineLatest([showId$, isAuthorized, history]).pipe(
    map(([showId, authorized, $history]) => {
      if (!showId || !authorized || !$history) return EMPTY_SEASON_INFO;

      const episodes = $history.shows.get(showId)?.episodes ??
        [{ season: -1 }];
      const season = Math.max(...episodes.map((episode) => episode.season));

      return {
        number: season,
        episodes: {
          count: episodes.filter((episode) => episode.season === season).length,
        },
      };
    }),
  );
}
