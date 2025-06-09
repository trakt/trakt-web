import { useQuery } from '$lib/features/query/useQuery.ts';
import { movieActivityHistoryQuery } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { showActivityHistoryQuery } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { derived } from 'svelte/store';
import { mapToMonthToDateDetails } from './_internal/mapToMonthToDateDetails.ts';

const HISTORY_LIMIT = 1000;

type UseMonthToDateProps = {
  slug: string;
};

export function useMonthToDate({ slug }: UseMonthToDateProps) {
  const now = new Date();

  const params = {
    limit: HISTORY_LIMIT,
    slug,
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),
    endDate: now,
  };

  const movies = useQuery(movieActivityHistoryQuery(params));
  const shows = useQuery(showActivityHistoryQuery(params));

  return {
    monthToDate: derived(
      [movies, shows],
      ([$movies, $shows]) => {
        return mapToMonthToDateDetails(
          $movies.data?.entries ?? [],
          $shows.data?.entries ?? [],
        );
      },
    ),
    isLoading: derived(
      [movies, shows],
      ($queries) => $queries.some((query) => query.isPending),
    ),
  };
}
