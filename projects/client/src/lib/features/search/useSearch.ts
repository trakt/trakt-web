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

const emptyResults = {
  movie: [] as MediaEntry[],
  show: [] as MediaEntry[],
};

export function useSearch() {
  type SearchResponse = {
    items: Record<MediaType, MediaEntry[]>;
    reason: 'initial' | 'result' | 'cancelled';
  };

  const results = writable<SearchResponse>({
    items: emptyResults,
    reason: 'initial',
  });
  const client = browser ? useQueryClient() : undefined;
  const { isSearching, ...rest } = getSearchContext();
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const types: MediaType[] = ['movie', 'show'];

  async function search(query: string) {
    if (!client) {
      return;
    }

    if (!query.trim()) {
      results.set({
        items: emptyResults,
        reason: 'initial',
      });
      return;
    }

    const fetches = types.map(async (type) => {
      try {
        const res = await client.fetchQuery(searchQuery({ query, type }));
        return { type, res };
      } catch (error) {
        if (error instanceof AbortError || error instanceof CancelledError) {
          return { type, res: [] };
        }
        throw error;
      }
    });

    try {
      const responses = await Promise.all(fetches);
      const items: Record<MediaType, MediaEntry[]> = { movie: [], show: [] };
      responses.forEach(({ type, res }) => {
        items[type] = res;
      });
      results.set({
        items,
        reason: 'result',
      });
    } catch (_) {
      results.set({
        items: emptyResults,
        reason: 'cancelled',
      });
    }
  }

  const unsubscribeFromResults = results
    .subscribe(({ reason }) => isSearching.set(reason === 'cancelled'));

  onDestroy(() => unsubscribeFromResults());

  function clear() {
    types.forEach((type) => {
      abortRequest(
        (id) => id.includes(searchCancellationId(type)),
        new CancelledError(),
      );
    });
    results.set({ items: emptyResults, reason: 'initial' });
  }

  return {
    search: (term: string) => {
      isSearching.set(true);
      debounce(search, get(isDesktop) ? 150 : 250)(term);
    },
    clear,
    results: derived(results, ($results) => $results.items ?? emptyResults),
    isSearching,
    ...rest,
  };
}
