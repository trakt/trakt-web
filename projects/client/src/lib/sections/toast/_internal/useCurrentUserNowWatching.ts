import { derived } from 'svelte/store';
import { useQuery } from '../../../features/query/useQuery.ts';
import { userWatchingQuery } from '../../../requests/queries/users/userWatchingQuery.ts';

export function useCurrentUserNowWatching() {
  const response = useQuery(userWatchingQuery({
    slug: 'me',
  }));

  return {
    nowWatching: derived(response, ($response) => $response.data ?? null),
  };
}
