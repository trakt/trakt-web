import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';
import type { Writable } from 'svelte/store';

export type SearchContext = {
  mode: Writable<SearchMode>;
  isSearching: Writable<boolean>;
  pathName: string;
  query: Writable<string>;
};
