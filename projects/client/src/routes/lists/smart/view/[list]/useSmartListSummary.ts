import { useQuery } from '$lib/features/query/useQuery.ts';
import { smartListSummaryQuery } from '$lib/requests/queries/smart-lists/smartListSummaryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, type Observable } from 'rxjs';

export function useSmartListSummary(listId$: Observable<string>) {
  const query = useQuery(
    listId$.pipe(map((listId) => smartListSummaryQuery({ listId }))),
  );

  return {
    list: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
