import { useQuery } from '$lib/features/query/useQuery.ts';

import { listSummaryQuery } from '$lib/requests/queries/users/listSummaryQuery.ts';
import { derived } from 'svelte/store';

type UseListSummaryProps = {
  userId: string;
  listId: string;
};

export function useListSummary(props: UseListSummaryProps) {
  const query = useQuery(listSummaryQuery(props));

  return {
    list: derived(query, ($query) => $query.data),
  };
}
