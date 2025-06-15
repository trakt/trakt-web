import { useQuery } from '$lib/features/query/useQuery.ts';

import { listSummaryQuery } from '$lib/requests/queries/lists/listSummaryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

type UseListSummaryProps = {
  listId: string;
};

export function useListSummary(props: UseListSummaryProps) {
  const query = useQuery(listSummaryQuery(props));

  return {
    list: derived(query, ($query) => $query.data),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
}
