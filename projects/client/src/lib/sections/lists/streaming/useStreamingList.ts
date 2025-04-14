import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import {
  movieStreamingQuery,
  type StreamingMovie,
} from '$lib/requests/queries/movies/movieStreamingQuery.ts';
import {
  showStreamingQuery,
  type StreamingShow,
} from '$lib/requests/queries/shows/showStreamingQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';

export type StreamingEntry = StreamingMovie | StreamingShow;
export type StreamingMediaList = Paginatable<StreamingEntry>;

type StreamingListStoreProps = PaginationParams & FilterParams & {
  type: MediaType;
};

function typeToQuery(
  params: StreamingListStoreProps,
) {
  switch (params.type) {
    case 'movie':
      return movieStreamingQuery(params) as CreateQueryOptions<
        StreamingMediaList
      >;
    case 'show':
      return showStreamingQuery(params) as CreateQueryOptions<
        StreamingMediaList
      >;
  }
}

export function useStreamingList(
  props: StreamingListStoreProps,
) {
  return usePaginatedListQuery(typeToQuery(props));
}
