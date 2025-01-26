import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery';
import { upNextQuery } from '$lib/requests/queries/sync/upNextQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState';
import { derived } from 'svelte/store';

const UP_NEXT_LIMIT = 100;

export const useUpNextEpisodes = () => {
  const { current: user } = useUser();

  const query = useQuery(upNextQuery({
    limit: UP_NEXT_LIMIT,
    sort: user().preferences.progress.sort,
  }));

  return {
    list: derived(query, ($query) => $query.data?.entries ?? []),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
};
