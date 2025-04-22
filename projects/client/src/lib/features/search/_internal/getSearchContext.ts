import { getContext } from 'svelte';
import { SEARCH_CONTEXT_KEY } from './SEARCH_CONTEXT_KEY.ts';
import type { SearchContext } from './SearchContext.ts';

export function getSearchContext() {
  const context = getContext<SearchContext>(SEARCH_CONTEXT_KEY);
  if (!context) {
    throw new Error(
      'Search context not found. Make sure to call use this within the SearchProvider scope.',
    );
  }
  return context;
}
