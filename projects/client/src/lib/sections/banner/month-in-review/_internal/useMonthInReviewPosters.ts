import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import { activityHistoryQuery } from '$lib/requests/queries/users/activityHistoryQuery.ts';
import { map, type Observable } from 'rxjs';
import { toMonthInReviewPosters } from './toMonthInReviewPosters.ts';
import { toMonthRange } from './toMonthRange.ts';

const HISTORY_SAMPLE_SIZE = 30;

export function useMonthInReviewPosters(month$: Observable<Date>) {
  const history = useInfiniteQuery(
    month$.pipe(
      map((month) =>
        activityHistoryQuery({
          slug: 'me',
          page: 1,
          limit: HISTORY_SAMPLE_SIZE,
          ...toMonthRange(month),
        }),
      ),
    ),
  );

  return {
    posters: history.pipe(
      map((result) =>
        toMonthInReviewPosters(result.data?.pages.at(0)?.entries ?? []),
      ),
    ),
  };
}
