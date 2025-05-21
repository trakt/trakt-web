import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { derived, get, readable } from 'svelte/store';

export const EMPTY_SEASON_INFO = { number: -1, episodes: { count: -1 } };

export function useUserSeason(showId: number | Nil) {
  if (!showId) return readable(EMPTY_SEASON_INFO);

  const { isAuthorized } = useAuth();
  if (!get(isAuthorized)) return readable(EMPTY_SEASON_INFO);

  const { history } = useUser();

  return derived(history, ($history) => {
    if (!$history) return EMPTY_SEASON_INFO;

    const episodes = $history?.shows.get(showId)?.episodes ?? [{ season: -1 }];
    const season = Math.max(...episodes.map((episode) => episode.season));

    return {
      number: season,
      episodes: {
        count: episodes.filter((episode) => episode.season === season).length,
      },
    };
  });
}
