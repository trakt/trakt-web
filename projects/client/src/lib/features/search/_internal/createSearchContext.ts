import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';
import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import { UrlBuilder } from '../../../utils/url/UrlBuilder.ts';
import type { SearchContext } from './SearchContext.ts';
import { searchKeyFactory } from './searchKeyFactory.ts';

type SearchContextProps = {
  mode?: SearchMode;
  mediaType?: MediaType;
  config: TypesenseConfig;
};

export function createSearchContext(
  { mode, mediaType, config }: SearchContextProps,
) {
  const ctx = setContext(
    searchKeyFactory(),
    getContext<SearchContext>(searchKeyFactory()) ??
      {
        mode: new BehaviorSubject(mode ?? 'media'),
        mediaType: new BehaviorSubject(mediaType),
        isSearching: new BehaviorSubject(false),
        pathName: UrlBuilder.search(),
        query: new BehaviorSubject(''),
        config,
      },
  );

  return ctx;
}
