import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';
import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { SearchContext } from './SearchContext.ts';
import { searchKeyFactory } from './searchKeyFactory.ts';

type SearchContextProps = {
  mode?: SearchMode;
  mediaType?: MediaType;
};

export function createSearchContext({ mode, mediaType }: SearchContextProps) {
  const ctx = setContext(
    searchKeyFactory(),
    getContext<SearchContext>(searchKeyFactory()) ??
      {
        mode: writable(mode ?? 'media'),
        mediaType: writable(mediaType),
        isSearching: writable(false),
        pathName: '/search',
        exitPathName: writable('/'),
        query: writable(''),
      },
  );

  return ctx;
}
