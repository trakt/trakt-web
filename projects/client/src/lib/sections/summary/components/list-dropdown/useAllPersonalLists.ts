import { useQuery } from '$lib/features/query/useQuery.ts';
import { userListsQuery } from '$lib/requests/queries/users/userListsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

// TODO use loading state
export function useAllPersonalLists() {
  const lists = useQuery(userListsQuery());

  const isLoading = derived(
    lists,
    toLoadingState,
  );

  return {
    lists: derived(lists, ($lists) => $lists.data ?? []),
    isLoading,
  };
}
