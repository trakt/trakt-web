import { useQuery } from '$lib/features/query/useQuery.ts';
import { userWatchingQuery } from '$lib/requests/queries/users/userWatchingQuery.ts';
import { derived } from 'svelte/store';

export function useNowPlaying() {
  const response = useQuery(userWatchingQuery({
    slug: 'me',
  }));

  return {
    nowPlaying: derived(response, ($response) => $response.data),
  };
}
