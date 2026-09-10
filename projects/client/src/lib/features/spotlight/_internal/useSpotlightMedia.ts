import { browser } from '$app/environment';
import { createBulkMediaIntl } from '$lib/features/intl-overlay/createBulkMediaIntl.ts';
import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import { ensureFreshSearchKeys } from '$lib/features/search/ensureFreshSearchKeys.ts';
import { useSearchConfig } from '$lib/features/search/useSearchConfig.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import {
  type MediaResult,
  searchMediaQuery,
} from '$lib/requests/queries/search/searchMediaQuery.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { BehaviorSubject, combineLatest, from, of, timer } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  skip,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import type { SpotlightMedia } from './models/SpotlightMedia.ts';

const MEDIA_LIMIT = 3;
const QUERY_DEBOUNCE = 200;

const EMPTY: SpotlightMedia = { movies: [], shows: [] };

function toSpotlightMedia(entries: ReadonlyArray<MediaResult>): SpotlightMedia {
  return {
    movies: entries.filter((entry) => entry.type === 'movie'),
    shows: entries.filter((entry) => entry.type === 'show'),
  };
}

export function useSpotlightMedia() {
  const client = browser ? useQueryClient() : undefined;
  const config = useSearchConfig();
  const overlay = createBulkMediaIntl<MediaResult>();

  const searchTerm$ = new BehaviorSubject<string>('');
  const isSearching = new BehaviorSubject<boolean>(false);

  const media = client == null ? of(EMPTY) : searchTerm$.pipe(
    map((rawTerm) => rawTerm.toLowerCase().trim()),
    distinctUntilChanged(),
    switchMap((term) => {
      if (term.length === 0) {
        isSearching.next(false);
        return of(EMPTY);
      }

      isSearching.next(true);

      const fetchType = (type: MediaType, searchConfig: TypesenseConfig) =>
        client.fetchQuery(
          searchMediaQuery({
            query: term,
            type,
            config: searchConfig,
            limit: MEDIA_LIMIT,
            exact: false,
          }),
        );

      return timer(QUERY_DEBOUNCE).pipe(
        switchMap(() => from(ensureFreshSearchKeys(config))),
        switchMap((freshConfig) =>
          combineLatest([
            fetchType('movie', freshConfig),
            fetchType('show', freshConfig),
          ])
        ),
        map(([movies, shows]) => [
          ...movies.items.slice(0, MEDIA_LIMIT),
          ...shows.items.slice(0, MEDIA_LIMIT),
        ]),
        overlay.operator,
        skip(1),
        map(toSpotlightMedia),
        tap(() => isSearching.next(false)),
        catchError(() => {
          isSearching.next(false);
          return of(EMPTY);
        }),
        // Prepended after the taps above, so the cleared value does not settle
        // the searching state: a new term drops the previous term's media
        // before its replacement is requested.
        startWith(EMPTY),
      );
    }),
    startWith(EMPTY),
    multicast(),
  );

  const search = (term: string) => searchTerm$.next(term);
  const clear = () => {
    searchTerm$.next('');
    isSearching.next(false);
  };

  return { media, isSearching, search, clear };
}
