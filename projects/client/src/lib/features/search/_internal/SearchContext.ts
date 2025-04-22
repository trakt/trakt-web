import type { Writable } from 'svelte/store';

export type SearchContext = {
  isSearching: Writable<boolean>;
  pathName: string;
  exitPathName: Writable<string>;
  query: Writable<string>;
};
