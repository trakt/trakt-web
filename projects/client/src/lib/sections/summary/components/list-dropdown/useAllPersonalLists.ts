import { useQuery } from '$lib/features/query/useQuery.ts';
import { userListsQuery } from '$lib/requests/queries/users/userListsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';

// TODO use loading state
export function useAllPersonalLists() {
  const lists = useQuery(userListsQuery());

  const isLoading = lists.pipe(map(toLoadingState));

  return {
    lists: lists.pipe(map(($lists) => $lists.data ?? [])),
    isLoading,
  };
}
