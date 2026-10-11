import { useQuery } from '$lib/features/query/useQuery.ts';
import { smartListDraftsSummaryQuery } from '$lib/requests/queries/users/smartListDraftsSummaryQuery.ts';
import { map } from 'rxjs';

export function useSmartListDraftsSummary() {
  const query = useQuery(smartListDraftsSummaryQuery());

  return {
    summary: query.pipe(map(($query) => $query.data)),
  };
}
