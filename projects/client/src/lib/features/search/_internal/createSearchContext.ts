import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import { SEARCH_CONTEXT_KEY } from './SEARCH_CONTEXT_KEY.ts';
import type { SearchContext } from './SearchContext.ts';

export function createSearchContext() {
  const ctx = setContext(
    SEARCH_CONTEXT_KEY,
    getContext<SearchContext>(SEARCH_CONTEXT_KEY) ??
      {
        isSearching: writable(false),
        pathName: '/search',
        exitPathName: writable('/'),
        query: writable(''),
      },
  );

  return ctx;
}
