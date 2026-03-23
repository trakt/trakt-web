import {
  movieActivityHistoryQuery,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import {
  showActivityHistoryQuery,
} from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { usePaginatedListQuery } from '../../lists/stores/usePaginatedListQuery.ts';

const historyLimit = 1000;

export function useActivityHistory(slug: string) {
  const now = new Date();
  const startDate = new Date(
    Date.UTC(
      now.getUTCFullYear() - 1,
      now.getUTCMonth(),
      now.getUTCDate(),
    ),
  );
  const endDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
    ),
  );

  const params = {
    limit: historyLimit,
    slug,
    startDate,
    endDate,
  };

  const { list: movies, isLoading: isLoadingMovies } = usePaginatedListQuery(
    movieActivityHistoryQuery(params),
  );
  const { list: shows, isLoading: isLoadingShows } = usePaginatedListQuery(
    showActivityHistoryQuery(params),
  );

  return { movies, shows, isLoadingMovies, isLoadingShows };
}
