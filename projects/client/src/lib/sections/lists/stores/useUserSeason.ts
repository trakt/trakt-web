import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { derived, get, writable } from 'svelte/store';

export function useUserSeason(showId: number) {
  const { isAuthorized } = useAuth();
  if (!get(isAuthorized)) return writable(0);

  const { history } = useUser();

  return derived(history, ($history) => {
    if (!$history) return -1;

    const episodes = $history?.shows.get(showId)?.episodes ?? [{ season: 0 }];

    return Math.max(...episodes.map((episode) => episode.season));
  });
}
