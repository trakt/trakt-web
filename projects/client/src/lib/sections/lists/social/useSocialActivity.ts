import { useQuery } from '$lib/features/query/useQuery.ts';
import { socialActivityQuery } from '$lib/requests/queries/users/socialActivityQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

export function useSocialActivity() {
  const query = useQuery(
    socialActivityQuery(),
  );

  const isLoading = derived(
    query,
    toLoadingState,
  );

  const list = derived(query, ($query) => $query.data ?? []);

  return {
    list,
    isLoading,
  };
}
