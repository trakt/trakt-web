import { browser } from '$app/environment';
import {
  searchQuery,
  searchQueryKey,
  type SearchResult,
} from '$lib/requests/queries/search/searchQuery.ts';
import { useMedia, WellKnownMediaQuery } from '$lib/utils/css/useMedia.ts';
import { debounce } from '$lib/utils/timing/debounce.ts';
import { CancelledError, useQueryClient } from '@tanstack/svelte-query';
import { onDestroy } from 'svelte';
import { get, writable } from 'svelte/store';

export function useSearch() {
  const results = writable([] as SearchResult[]);
  const client = browser ? useQueryClient() : undefined;
  const isSearching = writable(false);
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);

  async function search(query: string) {
    if (!client) {
      return;
    }

    if (!query.trim()) {
      results.set([]);
      return;
    }

    const response = await client.fetchQuery(searchQuery({
      query,
    })).catch((error) => {
      if (error instanceof CancelledError) {
        return new Promise<SearchResult[]>((resolve) => resolve([]));
      }

      return Promise.reject(error);
    });

    results.set(response.filter((result) => result.year != null));
  }

  const unsubscribeFromResults = results
    .subscribe(() => isSearching.set(false));

  onDestroy(() => unsubscribeFromResults());

  function clear() {
    client?.cancelQueries({
      predicate: (query) => query.queryKey.at(0) === searchQueryKey('').at(0),
    });
    results.set([]);
  }

  return {
    search: (term: string) => {
      isSearching.set(true);
      debounce(search, get(isDesktop) ? 150 : 250)(term);
    },
    clear,
    results,
    isSearching,
  };
}
