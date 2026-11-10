import { useQuery } from '$lib/features/query/useQuery.ts';
import { personMovieCreditsQuery } from '$lib/requests/queries/people/personMovieCreditsQuery.ts';
import { personShowCreditsQuery } from '$lib/requests/queries/people/personShowCreditsQuery.ts';
import { combineLatest, type Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { toCareerStart } from './toCareerStart.ts';

export function useCareerStart(slug$: Observable<string>) {
  const movies = useQuery(
    slug$.pipe(map((slug) => personMovieCreditsQuery({ slug }))),
  );
  const shows = useQuery(
    slug$.pipe(map((slug) => personShowCreditsQuery({ slug }))),
  );

  return combineLatest([movies, shows]).pipe(
    map(([$movies, $shows]) => toCareerStart([$movies.data, $shows.data])),
  );
}
