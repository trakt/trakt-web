import { browser } from '$app/environment';
import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import type { CreateQueryOptions } from '$lib/features/query/types.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { time } from '$lib/utils/timing/time.ts';
import { BehaviorSubject, combineLatest, from, merge, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  ignoreElements,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';
import type { SearchMode } from '../../requests/queries/search/models/SearchMode.ts';
import {
  searchListsQuery,
} from '../../requests/queries/search/searchListsQuery.ts';
import {
  type MediaSearchResult,
  searchMediaQuery,
} from '../../requests/queries/search/searchMediaQuery.ts';
import {
  searchPeopleQuery,
} from '../../requests/queries/search/searchPeopleQuery.ts';
import {
  searchTrendingQuery,
  type TrendingSearchesResult,
} from '../../requests/queries/search/searchTrendingQuery.ts';
import { dedupe } from '../../utils/array/dedupe.ts';
import { DEFAULT_SEARCH_LIMIT } from '../../utils/constants.ts';
import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../analytics/useTrack.ts';
import { createBulkMediaIntl } from '../intl-overlay/createBulkMediaIntl.ts';
import { getSearchContext } from './_internal/getSearchContext.ts';
import { mapToSearchCover } from './_internal/mapToSearchCover.ts';
import { postRecentSearch } from './_internal/postRecentSearch.ts';
import { splitExactByConfidence } from './_internal/splitExactByConfidence.ts';
import { ensureFreshSearchKeys } from './ensureFreshSearchKeys.ts';
import type { SearchResponse } from './models/SearchResponse.ts';

const QUERY_DEBOUNCE = 250;
// Deliberately longer than the query debounce: a keystroke gap on a touch
// keyboard exceeds 250ms, so sharing one reports a search per character.
const TRACK_DEBOUNCE = time.seconds(1);

function modeToQuery(
  query: string,
  mode: SearchMode,
  config: TypesenseConfig,
  exact: boolean,
) {
  const limit = DEFAULT_SEARCH_LIMIT;

  switch (mode) {
    case 'media':
    case 'movie':
    case 'show': {
      const type = mode !== 'media' ? mode : undefined;
      return searchMediaQuery({
        query,
        type,
        config,
        limit,
        exact,
      }) as CreateQueryOptions<SearchResponse>;
    }
    case 'people':
      return searchPeopleQuery({ query, config, limit }) as CreateQueryOptions<
        SearchResponse
      >;
    case 'lists':
      return searchListsQuery({ query, limit }) as CreateQueryOptions<
        SearchResponse
      >;
    default:
      throw new Error(`Unsupported search mode: ${mode}`);
  }
}

function modeToTrendingQuery(query: string, mode: SearchMode) {
  switch (mode) {
    case 'media':
    case 'movie':
    case 'show': {
      const type = mode !== 'media' ? mode : undefined;
      return searchTrendingQuery({ query, type }) as CreateQueryOptions<
        TrendingSearchesResult
      >;
    }
    default:
      throw new Error(`Unsupported trending search mode: ${mode}`);
  }
}

export function useSearch() {
  const client = browser ? useQueryClient() : undefined;
  const { mode, isSearching, config, ...rest } = getSearchContext();
  const { track } = useTrack(AnalyticsEvent.Search);

  const searchTerm$ = new BehaviorSubject<string>('');

  const searchIntent$ = combineLatest([
    searchTerm$,
    mode,
  ]).pipe(
    debounceTime(QUERY_DEBOUNCE),
    multicast(),
  );

  // `mode` is a shared context subject, so `searchIntent$` republishes the
  // current term whenever it re-emits, even carrying the same value. Without
  // the dedupe that counts as another search with nobody typing. `multicast`
  // keeps the tap off the per-subscriber path so the count cannot scale with
  // consumers.
  const trackedSearch$ = searchIntent$.pipe(
    map(([rawTerm, currentMode]) => ({
      term: rawTerm.toLowerCase().trim(),
      mode: currentMode,
    })),
    debounceTime(TRACK_DEBOUNCE),
    distinctUntilChanged((previous, next) =>
      previous.term === next.term && previous.mode === next.mode
    ),
    // After the dedupe, not before: clearing the box has to reach
    // `distinctUntilChanged` so searching the same term again still counts.
    filter(({ term }) => term.length > 0),
    tap(({ mode: currentMode }) => track({ mode: currentMode })),
    ignoreElements(),
    multicast(),
  );

  const searchResults$ = client == null ? of(null) : searchIntent$.pipe(
    switchMap(([rawTerm, currentMode]) => {
      const term = rawTerm.toLowerCase().trim();

      if (term.length === 0) {
        return of(null);
      }

      isSearching.next(true);

      return from(ensureFreshSearchKeys(config)).pipe(
        switchMap((freshConfig) => {
          const searchQuery = client.fetchQuery(
            modeToQuery(term, currentMode, freshConfig, false),
          );

          if (currentMode === 'people' || currentMode === 'lists') {
            return searchQuery;
          }

          const trendingQuery = client.fetchQuery(
            modeToTrendingQuery(term, currentMode),
          );

          const exactQuery = client.fetchQuery(
            modeToQuery(term, currentMode, freshConfig, true),
          );
          return combineLatest([exactQuery, searchQuery, trendingQuery]).pipe(
            map(([exactResults, searchResults, trendingResults]) => {
              // Only unambiguous exact hits lead; the deep catalog tail trails
              // the fuzzy results instead of displacing them.
              const { confident, deep } = splitExactByConfidence(
                (exactResults as MediaSearchResult).items,
              );

              return {
                type: 'media' as const,
                items: dedupe(
                  (item) => item.key,
                  confident,
                  trendingResults?.items ?? [],
                  (searchResults as MediaSearchResult).items,
                  deep,
                ),
              };
            }),
          );
        }),
        // Contain a failed lookup to this search. Without this the error
        // propagates through switchMap and terminates the whole stream, so
        // every later search silently returns nothing until remount.
        catchError(() => of(null)),
      );
    }),
    tap(() => isSearching.next(false)),
    multicast(),
  );

  // Tracking rides the results subscription, so it needs no separate teardown.
  const results = merge(searchResults$, trackedSearch$);

  const overlay = createBulkMediaIntl<MediaSearchResult['items'][number]>();

  const localizedResults = results.pipe(
    switchMap((response) => {
      if (response?.type !== 'media') {
        return of(response);
      }
      return of(response.items).pipe(
        overlay.operator,
        map((items) => ({ ...response, items })),
      );
    }),
    shareReplay(1),
  );

  const coverSrc = localizedResults.pipe(
    map(mapToSearchCover),
  );

  function search(term: string, searchMode: SearchMode) {
    mode.next(searchMode);
    searchTerm$.next(term);
  }

  function clear() {
    searchTerm$.next('');
    isSearching.next(false);
  }

  return {
    postRecentSearch,
    search,
    results: localizedResults,
    coverSrc,
    clear,
    mode,
    isSearching,
    ...rest,
  };
}
