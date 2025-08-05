import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { SearchContext } from './SearchContext.ts';
import { searchKeyFactory } from './searchKeyFactory.ts';

export function createSearchContext() {
  const ctx = setContext(
    searchKeyFactory(),
    getContext<SearchContext>(searchKeyFactory()) ??
      {
        isSearching: writable(false),
        pathName: '/search',
        exitPathName: writable('/'),
        query: writable(''),
      },
  );

  return ctx;
}
