import { movieActivityHistoryQuery } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { showActivityHistoryQuery } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { combineLatest, map } from 'rxjs';
import { usePaginatedListQuery } from '../../lists/stores/usePaginatedListQuery.ts';
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

  const { list: movies, isLoading: isLoadingMovies } = usePaginatedListQuery(
    movieActivityHistoryQuery(params),
  );
  const { list: shows, isLoading: isLoadingShows } = usePaginatedListQuery(
    showActivityHistoryQuery(params),
  );

  return {
    monthToDate: combineLatest([
      toObservable(movies),
      toObservable(shows),
    ]).pipe(
      map(([m, s]) => mapToMonthToDateDetails(m, s)),
    ),
    isLoading: combineLatest([
      toObservable(isLoadingMovies),
      toObservable(isLoadingShows),
    ]).pipe(
      map(([m, s]) => m || s),
    ),
  };
}
