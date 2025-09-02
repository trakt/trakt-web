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
import { useMedia, WellKnownMediaQuery } from '$lib/stores/css/useMedia.ts';
import { debounce } from '$lib/utils/timing/debounce.ts';
import {
  CancelledError,
  type CreateQueryOptions,
  useQueryClient,
} from '@tanstack/svelte-query';
import { AbortError, abortRequest } from '@trakt/api';
import { onDestroy } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import { getSearchContext } from './_internal/getSearchContext.ts';
import type { SearchResult } from './models/SearchResult.ts';

type SearchResponse = MediaSearchResult | PeopleSearchResult;

function modeToQuery(query: string, mode: SearchMode) {
  switch (mode) {
    case 'media':
    case 'movie':
    case 'show': {
      const type = mode !== 'media' ? mode : undefined;
      return searchMediaQuery({ query, type }) as CreateQueryOptions<
        SearchResponse
      >;
    }
    case 'people':
      return searchPeopleQuery({ query }) as CreateQueryOptions<
        SearchResponse
      >;
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
  }
}

export function useSearch() {
  const client = browser ? useQueryClient() : undefined;
  const { mode, isSearching, ...rest } = getSearchContext();
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);

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

    const query = modeToQuery(term, mode);

    const response = await client.fetchQuery(query)
      .then((response) => {
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

  return {
    search: (term: string, mode: SearchMode) => {
      isSearching.set(true);
      debounce(() => search(term, mode), get(isDesktop) ? 150 : 250)();
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
