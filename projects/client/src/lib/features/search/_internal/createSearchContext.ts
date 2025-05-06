import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { SearchContext } from './SearchContext.ts';
import { searchKeyFactory } from './searchKeyFactory.ts';

export function createSearchContext(type: string) {
  const ctx = setContext(
    searchKeyFactory(type),
    getContext<SearchContext>(searchKeyFactory(type)) ??
      {
        isSearching: writable(false),
        pathName: '/search',
        exitPathName: writable('/'),
        query: writable(''),
      },
  );

  return ctx;
}
