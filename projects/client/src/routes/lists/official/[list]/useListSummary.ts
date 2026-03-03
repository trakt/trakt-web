import { useQuery } from '$lib/features/query/useQuery.ts';

import { listSummaryQuery } from '$lib/requests/queries/lists/listSummaryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';

type UseListSummaryProps = {
  listId: string;
};

export function useListSummary(props: UseListSummaryProps) {
  const query = useQuery(listSummaryQuery(props));

  return {
    list: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
