import { browser } from '$app/environment';
import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';
import { searchCancellationId } from '$lib/requests/queries/search/searchCancellationId.ts';
import {
  type MediaSearchResult,
  searchMediaQuery,
} from '$lib/requests/queries/search/searchMediaQuery.ts';
import {
  type PeopleSearchResult,
  searchPeopleQuery,
} from '$lib/requests/queries/search/searchPeopleQuery.ts';
import { debounce } from '$lib/utils/timing/debounce.ts';
import {
  CancelledError,
  type CreateQueryOptions,
  useQueryClient,
} from '@tanstack/svelte-query';
import { AbortError, abortRequest } from '@trakt/api';
import { onDestroy } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import { DEFAULT_SEARCH_LIMIT } from '../../utils/constants.ts';
import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../analytics/useTrack.ts';
import { getSearchContext } from './_internal/getSearchContext.ts';
import { postRecentSearch } from './_internal/postRecentSearch.ts';
import type { SearchResult } from './models/SearchResult.ts';

type SearchResponse = MediaSearchResult | PeopleSearchResult;

function modeToQuery(query: string, mode: SearchMode, config: TypesenseConfig) {
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
      }) as CreateQueryOptions<
        SearchResponse
      >;
    }
    case 'people':
      return searchPeopleQuery({ query, config, limit }) as CreateQueryOptions<
        SearchResponse
      >;
    default:
      throw new Error(`Unsupported search mode: ${mode}`);
  }
}

function modeToCancellationIds(mode: SearchMode) {
  switch (mode) {
    case 'media':
      return [
        searchCancellationId('movie'),
        searchCancellationId('show'),
      ];
    case 'movie':
      return [searchCancellationId('movie')];
    case 'show':
      return [searchCancellationId('show')];
    case 'people':
      return [searchCancellationId('person')];
    default:
      throw new Error(`Unsupported search mode: ${mode}`);
  }
}

export function useSearch() {
  const client = browser ? useQueryClient() : undefined;
  const { mode, isSearching, config, ...rest } = getSearchContext();
  const { track } = useTrack(AnalyticsEvent.Search);

  const results = writable<SearchResult>({
    response: null,
    reason: 'initial',
  });

  async function search(term: string, mode: SearchMode) {
    if (!client) {
      return;
    }

    if (!term.trim()) {
      results.set({
        response: null,
        reason: 'initial',
      });
      return;
    }

    const query = modeToQuery(term, mode, config);

    const response = await client.fetchQuery(query)
      .then((response) => {
        track({ mode });

        if (response.type === 'media') {
          return {
            response,
            reason: 'result',
          };
        }

        return {
          response,
          reason: 'result',
        };
      })
      .catch((error) => {
        if (error instanceof AbortError) {
          return Promise.resolve({
            ...get(results),
            reason: 'cancelled',
          });
        }

        if (error instanceof CancelledError) {
          return Promise.resolve({
            response: null,
            reason: 'cancelled',
          });
        }

        return Promise.reject(error);
      });

    results.set({
      ...response,
      reason: 'result',
    });
  }

  const unsubscribeFromResults = results
    .subscribe(({ reason }) => isSearching.set(reason === 'cancelled'));

  onDestroy(() => unsubscribeFromResults());

  function clear() {
    const ids = modeToCancellationIds(get(mode));

    ids.forEach((id) => {
      abortRequest(
        (requestId) => requestId.includes(id),
        new CancelledError(),
      );
    });

    results.set({ response: null, reason: 'initial' });
  }

  const debouncedSearch = debounce((term: string, mode: string) => {
    search(term, mode as SearchMode);
  }, 150);

  return {
    postRecentSearch,
    search: (term: string, mode: SearchMode) => {
      isSearching.set(true);
      debouncedSearch(term, mode);
    },
    results: derived(results, ($results) => $results.response),
    clear,
    mode,
    targetParams: derived(mode, ($mode) => {
      return {
        m: $mode,
      };
    }),
    isSearching,
    ...rest,
  };
}
