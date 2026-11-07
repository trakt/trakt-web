import { useQuery } from '$lib/features/query/useQuery.ts';
import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';
import { combineLatest, filter, map, type Observable, startWith } from 'rxjs';
import type { MatchStripEntry } from './buildMatchStrip.ts';

type SharedMediaRef = Pick<MatchStripEntry, 'id' | 'type'>;

const slugOf = ({ id }: SharedMediaRef) => ({ slug: id.toString() });

export function useSharedMedia(entry$: Observable<SharedMediaRef | undefined>) {
  const ofType = (type: SharedMediaRef['type']) =>
    entry$.pipe(
      filter((entry): entry is SharedMediaRef => entry?.type === type),
      map(slugOf),
    );

  const movie$ = useQuery(ofType('movie').pipe(map(movieSummaryQuery)));
  const show$ = useQuery(ofType('show').pipe(map(showSummaryQuery)));

  return combineLatest([
    entry$,
    movie$.pipe(startWith(undefined)),
    show$.pipe(startWith(undefined)),
  ]).pipe(
    map(([entry, movie, show]) =>
      entry?.type === 'movie' ? movie?.data : show?.data,
    ),
  );
}
