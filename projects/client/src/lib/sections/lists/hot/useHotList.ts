import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import {
  type HotMovie,
  movieHotQuery,
} from '$lib/requests/queries/movies/movieHotQuery.ts';
import {
  type HotShow,
  showHotQuery,
} from '$lib/requests/queries/shows/showHotQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type HotEntry = HotMovie | HotShow;
export type HotMediaList = Paginatable<HotEntry>;

type HotListStoreProps = PaginationParams & FilterParams & SearchParams & {
  type: MediaType;
};

function typeToQuery(
  params: HotListStoreProps,
) {
  switch (params.type) {
    case 'movie':
      return movieHotQuery(params) as CreateQueryOptions<
        HotMediaList
      >;
    case 'show':
      return showHotQuery(params) as CreateQueryOptions<HotMediaList>;
  }
}

export function useHotList(
  props: HotListStoreProps,
) {
  const { list, page, isLoading } = usePaginatedListQuery(typeToQuery(props));

  // TODO: remove this filter when the server is fixed
  return {
    list: derived(
      list,
      ($list) => $list.filter((entry) => entry.id !== 0 && entry.slug !== null),
    ),
    page,
    isLoading,
  };
}
