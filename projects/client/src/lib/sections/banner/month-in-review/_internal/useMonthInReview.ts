import { useQuery } from '$lib/features/query/useQuery.ts';
import { monthInReviewQuery } from '$lib/requests/queries/users/monthInReviewQuery.ts';
import { derived } from 'svelte/store';

type UseMonthInReviewProps = {
  slug: string;
  year: number;
  month: number;
};

export function useMonthInReview(props: UseMonthInReviewProps) {
  const query = useQuery(monthInReviewQuery(props));

  return {
    review: derived(query, ($query) => $query.data),
  };
}
