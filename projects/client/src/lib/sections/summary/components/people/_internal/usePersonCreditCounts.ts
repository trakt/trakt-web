import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaCredits } from '$lib/requests/models/MediaCredits.ts';
import { personMovieCreditsQuery } from '$lib/requests/queries/people/personMovieCreditsQuery.ts';
import { personShowCreditsQuery } from '$lib/requests/queries/people/personShowCreditsQuery.ts';
import { combineLatest, map, type Observable, switchMap } from 'rxjs';

export type PersonCreditCounts = {
  movies: number;
  shows: number;
  /*
    Exposed so the header can hold the stats' space while they load. Without it the
    grid restructured the moment they arrived - the crown went from one column to
    three and the portrait re-laid-out beneath it, which is what made their arrival
    look like a glitch rather than a load.
  */
  isLoading: boolean;
};

/**
 * How many films and shows a person has been in.
 *
 * Counts DISTINCT titles, not credits. `MediaCredits` is keyed by crew position,
 * so someone who both directed and starred in a film appears under two positions -
 * summing the lists would count that film twice and quietly inflate every
 * multi-hyphenate's numbers.
 *
 * These are the same queries the credit lists further down the page already run,
 * so this is normally served from cache rather than costing two more requests.
 */
function countDistinctTitles(credits: MediaCredits | undefined): number {
  if (!credits) {
    return 0;
  }

  const ids = new Set(
    Array.from(credits.values())
      .flat()
      .map((credit) => credit.media.id),
  );

  return ids.size;
}

export function usePersonCreditCounts(
  slug$: Observable<string>,
): Observable<PersonCreditCounts> {
  const movies = slug$.pipe(
    switchMap((slug) =>
      useQuery(personMovieCreditsQuery({ slug, filter: {} }))
    ),
  );

  const shows = slug$.pipe(
    switchMap((slug) => useQuery(personShowCreditsQuery({ slug, filter: {} }))),
  );

  return combineLatest([movies, shows]).pipe(
    map(([$movies, $shows]) => ({
      movies: countDistinctTitles($movies.data),
      shows: countDistinctTitles($shows.data),
      isLoading: $movies.isLoading || $shows.isLoading,
    })),
  );
}
