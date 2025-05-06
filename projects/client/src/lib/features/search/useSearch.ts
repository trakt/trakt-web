import { browser } from '$app/environment';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import {
  searchCancellationId,
  searchQuery,
} from '$lib/requests/queries/search/searchQuery.ts';
import { useMedia, WellKnownMediaQuery } from '$lib/stores/css/useMedia.ts';
import { debounce } from '$lib/utils/timing/debounce.ts';
import { CancelledError, useQueryClient } from '@tanstack/svelte-query';
import { AbortError, abortRequest } from '@trakt/api';
import { onDestroy } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import type { MediaType } from '../../requests/models/MediaType.ts';
import { getSearchContext } from './_internal/getSearchContext.ts';

export function useSearch(type: MediaType) {
  type SearchResponse = {
    items: MediaEntry[];
    reason: 'initial' | 'result' | 'cancelled';
  };

  const results = writable<SearchResponse>({
    items: [] as MediaEntry[],
    reason: 'initial',
  });
  const client = browser ? useQueryClient() : undefined;
  const { isSearching, ...rest } = getSearchContext();
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);

  async function search(query: string) {
    if (!client) {
      return;
    }

    if (!query.trim()) {
      results.set({
        items: [],
        reason: 'initial',
      });
      return;
    }

    const response = await client.fetchQuery(searchQuery({
      query,
      type,
    }))
      .then((response) => ({
        items: response,
        reason: 'result',
      } as SearchResponse))
      .catch((error) => {
        if (error instanceof AbortError) {
          return Promise.resolve<SearchResponse>({
            ...get(results),
            reason: 'cancelled',
          });
        }

        if (error instanceof CancelledError) {
          return Promise.resolve<SearchResponse>({
            items: [],
            reason: 'cancelled',
          });
        }

        return Promise.reject(error);
      });

    results.set({
      items: response
        .items,
      reason: response.reason,
    });
  }

  const unsubscribeFromResults = results
    .subscribe(({ reason }) => isSearching.set(reason === 'cancelled'));

  onDestroy(() => unsubscribeFromResults());

  function clear() {
    abortRequest(
      (id) => id.includes(searchCancellationId(type)),
      new CancelledError(),
    );
    results.set({ items: [], reason: 'initial' });
  }

  return {
    search: (term: string) => {
      isSearching.set(true);
      debounce(search, get(isDesktop) ? 150 : 250)(term);
    },
    clear,
    results: derived(results, ($results) => $results.items ?? []),
    isSearching,
    ...rest,
  };
}
