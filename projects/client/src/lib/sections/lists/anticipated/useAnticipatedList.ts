import type { MediaType } from '$lib/models/MediaType.ts';
import type { Paginatable } from '$lib/models/Paginatable';
import {
  type AnticipatedMovie,
  movieAnticipatedQuery,
} from '$lib/requests/queries/movies/movieAnticipatedQuery.ts';
import { showAnticipatedQuery } from '$lib/requests/queries/shows/showAnticipatedQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type AnticipatedMediaItem = AnticipatedMovie;
export type AnticipatedMedia = Array<AnticipatedMediaItem>;

type AnticipatedListStoreProps = {
  type: MediaType;
  limit?: number;
  page?: number;
};

function typeToQuery(
  { type, limit, page }: AnticipatedListStoreProps,
): CreateQueryOptions<Paginatable<AnticipatedMediaItem>> {
  const params = {
    limit,
    page,
  };

  switch (type) {
    case 'movie':
      return movieAnticipatedQuery(params);
    case 'show':
      return showAnticipatedQuery(params);
  }
}

export function useAnticipatedList(
  props: AnticipatedListStoreProps,
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
