import { useQuery } from '$lib/features/query/useQuery.ts';
import { yearInReviewQuery } from '$lib/requests/queries/users/yearInReviewQuery.ts';
import { map } from 'rxjs';

type UseYearInReviewProps = {
  slug: string;
  year: number;
};

export function useYearInReview(props: UseYearInReviewProps) {
  const query = useQuery(yearInReviewQuery(props));

  return {
    review: query.pipe(map(($query) => $query.data)),
  };
}
