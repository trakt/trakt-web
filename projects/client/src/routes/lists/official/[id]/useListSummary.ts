import { useQuery } from '$lib/features/query/useQuery.ts';

import { listSummaryQuery } from '$lib/requests/queries/lists/listSummaryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map } from 'rxjs';

type UseListSummaryProps = {
  listId: string;
};

export function useListSummary(props: UseListSummaryProps) {
  const query = useQuery(listSummaryQuery(props));
  const query$ = toObservable(query);

  return {
    list: query$.pipe(map((q) => q.data)),
    isLoading: query$.pipe(map(toLoadingState)),
  };
}
