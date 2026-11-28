import { getAuthContext } from '$lib/features/auth/stores/getAuthContext.ts';
import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import { activityHistoryQuery } from '$lib/requests/queries/users/activityHistoryQuery.ts';
import { map } from 'rxjs';
import { fanSplitFromHistory } from './fanSplitFromHistory.ts';

const HISTORY_SAMPLE = 100;

export function useFanSplit() {
  const { isAuthorized } = getAuthContext();

  const query = useInfiniteQuery(
    isAuthorized.pipe(
      map((authorized) => ({
        ...activityHistoryQuery({ slug: 'me', limit: HISTORY_SAMPLE, page: 1 }),
        enabled: authorized,
      })),
    ),
  );

  return query.pipe(
    map((result) =>
      fanSplitFromHistory(
        result.data?.pages.flatMap((page) => page.entries) ?? [],
      ),
    ),
  );
}
