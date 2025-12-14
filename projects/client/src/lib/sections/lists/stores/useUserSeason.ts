import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { map, of } from 'rxjs';

export const EMPTY_SEASON_INFO = { number: -1, episodes: { count: -1 } };

export function useUserSeason(showId: number | Nil) {
  if (!showId) return of(EMPTY_SEASON_INFO);

  const { isAuthorized } = useAuth();
  if (!isAuthorized.value) return of(EMPTY_SEASON_INFO);

  const { history } = useUser();

  return history.pipe(
    map(($history) => {
      if (!$history) return EMPTY_SEASON_INFO;

      const episodes = $history?.shows.get(showId)?.episodes ??
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
