import { useQuery } from '$lib/features/query/useQuery.ts';
import { smartListSummaryQuery } from '$lib/requests/queries/smart-lists/smartListSummaryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';

type UseSmartListSummaryProps = {
  listId: string;
};

export function useSmartListSummary(props: UseSmartListSummaryProps) {
  const query = useQuery(smartListSummaryQuery(props));

  return {
    list: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
