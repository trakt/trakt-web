import { useQuery } from '$lib/features/query/useQuery.ts';
import { showSeasonsQuery } from '$lib/requests/queries/shows/showSeasonsQuery.ts';
import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function useShowGlance(slug$: Observable<string>) {
  const show = useQuery(
    slug$.pipe(map((slug) => showSummaryQuery({ slug }))),
  );

  const seasons = useQuery(
    slug$.pipe(map((slug) => showSeasonsQuery({ slug }))),
  );

  return {
    show: show.pipe(map(($show) => $show.data)),
    seasons: seasons.pipe(map(($seasons) => $seasons.data)),
    isLoading: combineLatest([show, seasons]).pipe(
      map(($queries) =>
        $queries.some(toLoadingState) ||
        $queries.some(($query) => $query.data == null)
      ),
    ),
  };
}
