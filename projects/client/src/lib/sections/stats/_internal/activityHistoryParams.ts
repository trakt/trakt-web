import {
  movieActivityHistoryQuery,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import {
  showActivityHistoryQuery,
} from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { combineLatest, filter } from 'rxjs';
import { usePaginatedListQuery } from '../../lists/stores/usePaginatedListQuery.ts';

const historyLimit = 1000;

export function useActivityHistory(slug: string) {
  const now = new Date();
  const startDate = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate(),
  );
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  const params = {
    limit: historyLimit,
    slug,
    startDate,
    endDate,
  };

  const {
    list: movies,
    isLoading: isLoadingMovies,
    hasNextPage: hasNextMoviePage,
    fetchNextPage: fetchNextMoviePage,
  } = usePaginatedListQuery(movieActivityHistoryQuery(params));

  const {
    list: shows,
    isLoading: isLoadingShows,
    hasNextPage: hasNextShowPage,
    fetchNextPage: fetchNextShowPage,
  } = usePaginatedListQuery(showActivityHistoryQuery(params));

  // Auto-fetch all pages for accurate streak calculation
  combineLatest([hasNextMoviePage, isLoadingMovies]).pipe(
    filter(([hasNext, loading]) => hasNext && !loading),
  ).subscribe(() => {
    fetchNextMoviePage();
  });

  combineLatest([hasNextShowPage, isLoadingShows]).pipe(
    filter(([hasNext, loading]) => hasNext && !loading),
  ).subscribe(() => {
    fetchNextShowPage();
  });

  return { movies, shows, isLoadingMovies, isLoadingShows };
}
