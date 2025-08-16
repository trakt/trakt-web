import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';
import type { Writable } from 'svelte/store';

export type SearchContext = {
  mode: Writable<SearchMode>;
  mediaType: Writable<MediaType | undefined>;
  isSearching: Writable<boolean>;
  pathName: string;
  exitPathName: Writable<string>;
  query: Writable<string>;
};
