import { useQuery } from '$lib/features/query/useQuery.ts';
import { monthInReviewQuery } from '$lib/requests/queries/users/monthInReviewQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';

type UseMonthInReviewProps = {
  slug: string;
  year: number;
  month: number;
};

export function useMonthInReview(props: UseMonthInReviewProps) {
  const query = useQuery(monthInReviewQuery(props));

  return {
    review: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
