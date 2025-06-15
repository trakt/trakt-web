import { useQuery } from '$lib/features/query/useQuery.ts';

import { userListSummaryQuery } from '$lib/requests/queries/users/userListSummaryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

type UseUserListSummaryProps = {
  userId: string;
  listId: string;
};

export function userListSummary(props: UseUserListSummaryProps) {
  const query = useQuery(userListSummaryQuery(props));

  return {
    list: derived(query, ($query) => $query.data),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
}
