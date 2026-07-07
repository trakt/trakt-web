import { browser } from '$app/environment';
import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import { getSearchContext } from '$lib/features/search/_internal/getSearchContext.ts';
import {
  type MediaResult,
  searchMediaQuery,
} from '$lib/requests/queries/search/searchMediaQuery.ts';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import {
  debounceTime,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

const SPOTLIGHT_MEDIA_LIMIT = 3;

type SpotlightMediaResults = {
  movies: ReadonlyArray<MediaResult>;
  shows: ReadonlyArray<MediaResult>;
};

const EMPTY: SpotlightMediaResults = { movies: [], shows: [] };

export function useSpotlightMedia() {
  const client = browser ? useQueryClient() : undefined;
  const { config } = getSearchContext();

  const searchTerm$ = new BehaviorSubject<string>('');
  const isSearching = new BehaviorSubject<boolean>(false);

  const media = client == null ? of(EMPTY) : searchTerm$.pipe(
    debounceTime(200),
    switchMap((rawTerm) => {
      const term = rawTerm.toLowerCase().trim();

      if (term.length === 0) {
        isSearching.next(false);
        return of(EMPTY);
      }

      isSearching.next(true);

      const fetchType = (type: 'movie' | 'show') =>
        client.fetchQuery(
          searchMediaQuery({
            query: term,
            type,
            config,
            limit: SPOTLIGHT_MEDIA_LIMIT,
            exact: false,
          }),
        );

      return combineLatest([fetchType('movie'), fetchType('show')]).pipe(
        map(([movieResults, showResults]) => ({
          movies: movieResults.items.slice(0, SPOTLIGHT_MEDIA_LIMIT),
          shows: showResults.items.slice(0, SPOTLIGHT_MEDIA_LIMIT),
        })),
      );
    }),
    tap(() => isSearching.next(false)),
    startWith(EMPTY),
    shareReplay(1),
  );

  const search = (term: string) => searchTerm$.next(term);
  const clear = () => {
    searchTerm$.next('');
    isSearching.next(false);
  };

  return { media, isSearching, search, clear };
}
