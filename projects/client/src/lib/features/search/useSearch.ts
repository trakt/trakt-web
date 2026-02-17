import { browser } from '$app/environment';
import {
  type CreateQueryOptions,
  useQueryClient,
} from '@tanstack/svelte-query';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { debounceTime, map, shareReplay, switchMap, tap } from 'rxjs/operators';
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
import { getSearchContext } from './_internal/getSearchContext.ts';
import { mapToSearchCover } from './_internal/mapToSearchCover.ts';
import { postRecentSearch } from './_internal/postRecentSearch.ts';
import type { SearchResponse } from './models/SearchResponse.ts';

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
      return searchTrendingQuery({ query }) as CreateQueryOptions<
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

  const results = client == null ? of(null) : combineLatest([
    searchTerm$,
    mode,
  ]).pipe(
    debounceTime(150),
    switchMap(([rawTerm, currentMode]) => {
      const term = rawTerm.toLowerCase().trim();

      if (term.trim().length === 0) {
        return of(null);
      }

      isSearching.next(true);
      track({ mode: currentMode });

      const searchQuery = client.fetchQuery(
        modeToQuery(term, currentMode, config, false),
      );

      if (currentMode === 'people' || currentMode === 'lists') {
        return searchQuery;
      }

      const trendingQuery = client.fetchQuery(
        modeToTrendingQuery(term, currentMode),
      );

      const exactQuery = client.fetchQuery(
        modeToQuery(term, currentMode, config, true),
      );
      return combineLatest([exactQuery, searchQuery, trendingQuery]).pipe(
        map(([exactResults, searchResults, trendingResults]) => ({
          type: 'media' as const,
          items: dedupe(
            (item) => item.key,
            (exactResults as MediaSearchResult).items,
            trendingResults?.items ?? [],
            (searchResults as MediaSearchResult).items,
          ),
        })),
      );
    }),
    tap(() => isSearching.next(false)),
    shareReplay(1),
  );

  const coverSrc = results.pipe(
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
    results,
    coverSrc,
    clear,
    mode,
    isSearching,
    ...rest,
  };
}
