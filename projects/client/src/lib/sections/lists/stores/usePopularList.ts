import type { MediaType } from '$lib/models/MediaType.ts';
import type { Paginatable } from '$lib/models/Paginatable';
import { type MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { moviePopularQuery } from '$lib/requests/queries/movies/moviePopularQuery.ts';
import {
  type PopularShow,
  showPopularQuery,
} from '$lib/requests/queries/shows/showPopularQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type PopularMediaItem = PopularShow | MovieSummary;
export type PopularMedia = Array<PopularMediaItem>;

type PopularListStoreProps = {
  type: MediaType;
  limit?: number;
  page?: number;
};

function typeToQuery(
  { type, limit, page }: PopularListStoreProps,
): CreateQueryOptions<Paginatable<PopularMediaItem>> {
  const params = {
    limit,
    page,
  };

  switch (type) {
    case 'movie':
      return moviePopularQuery(params);
    case 'show':
      return showPopularQuery(params);
  }
}

export function usePopularList(
  props: PopularListStoreProps,
) {
  const query = createQuery({
    ...typeToQuery(props),
    staleTime: time.hours(1),
  });

  return {
    list: derived(query, ($query) => $query.data?.entries ?? []),
    page: derived(
      query,
      ($query) => $query.data?.page ?? { page: 0, total: 0 },
    ),
  };
}
