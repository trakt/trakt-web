import { movieActivityHistoryQuery } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { showActivityHistoryQuery } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { combineLatest, map } from 'rxjs';
import { usePaginatedListQuery } from '../../lists/stores/usePaginatedListQuery.ts';
import { mapToMonthToDateDetails } from './_internal/mapToMonthToDateDetails.ts';

const HISTORY_LIMIT = 1000;

type UseMonthToDateProps = {
  slug: string;
};

export function useMonthToDate({ slug }: UseMonthToDateProps) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  const params = {
    limit: HISTORY_LIMIT,
    slug,
    startDate: new Date(Date.UTC(year, month, 1)),
    endDate: new Date(Date.UTC(year, month, now.getUTCDate() + 1)),
  };

  const { list: movies, isLoading: isLoadingMovies } = usePaginatedListQuery(
    movieActivityHistoryQuery(params),
  );
  const { list: shows, isLoading: isLoadingShows } = usePaginatedListQuery(
    showActivityHistoryQuery(params),
  );

  return {
    monthToDate: combineLatest([movies, shows]).pipe(
      map(
        ([$movies, $shows]) => mapToMonthToDateDetails($movies, $shows),
      ),
    ),
    isLoading: combineLatest([isLoadingMovies, isLoadingShows]).pipe(
      map(
        ([$isLoadingMovies, $isLoadingShows]) =>
          $isLoadingMovies || $isLoadingShows,
      ),
    ),
  };
}
