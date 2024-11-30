import { browser } from '$app/environment';
import {
  searchQuery,
  type SearchResult,
} from '$lib/requests/queries/search/searchQuery.ts';
import { useQueryClient } from '@tanstack/svelte-query';
import { writable } from 'svelte/store';

export function useSearch() {
  const results = writable([] as SearchResult[]);
  const client = browser ? useQueryClient() : undefined;

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
    }));

    results.set(response);
  }

  return {
    search,
    results,
  };
}
