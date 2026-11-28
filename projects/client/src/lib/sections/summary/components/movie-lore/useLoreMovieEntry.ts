import { useQuery } from '$lib/features/query/useQuery.ts';
import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { map, type Observable } from 'rxjs';

export function useLoreMovieEntry(slug$: Observable<string>) {
  return useQuery(slug$.pipe(map((slug) => movieSummaryQuery({ slug })))).pipe(
    map(({ data }) => data),
  );
}
