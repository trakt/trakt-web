import { useQuery } from '$lib/features/query/useQuery.ts';
import { hiddenShowsQuery } from '$lib/requests/queries/users/hiddenShowsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

export const useHiddenShows = () => {
  const query = useQuery(hiddenShowsQuery());

  return {
    list: derived(
      query,
      ($query) => ($query.data ?? []).map((entry) => entry.show.id),
    ),
    isLoading: derived(query, toLoadingState),
  };
};
