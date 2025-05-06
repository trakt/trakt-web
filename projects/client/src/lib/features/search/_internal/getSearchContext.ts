import { getContext } from 'svelte';
import type { SearchContext } from './SearchContext.ts';
import { searchKeyFactory } from './searchKeyFactory.ts';

export function getSearchContext(type: string) {
  const context = getContext<SearchContext>(searchKeyFactory(type));
  if (!context) {
    throw new Error(
      'Search context not found. Make sure to call use this within the SearchProvider scope.',
    );
  }
  return context;
}
