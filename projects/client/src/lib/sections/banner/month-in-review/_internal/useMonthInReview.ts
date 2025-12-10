import { useQuery } from '$lib/features/query/useQuery.ts';
import { monthInReviewQuery } from '$lib/requests/queries/users/monthInReviewQuery.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map } from 'rxjs';

type UseMonthInReviewProps = {
  slug: string;
  year: number;
  month: number;
};

export function useMonthInReview(props: UseMonthInReviewProps) {
  const query = useQuery(monthInReviewQuery(props));
  const query$ = toObservable(query);

  return {
    review: query$.pipe(map((q) => q.data)),
  };
}
