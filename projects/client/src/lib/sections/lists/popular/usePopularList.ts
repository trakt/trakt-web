import { useQuery } from '$lib/features/query/useQuery.ts';
import { type MovieEntry } from '$lib/requests/models/MovieEntry';
import { moviePopularQuery } from '$lib/requests/queries/movies/moviePopularQuery.ts';
import {
  type PopularShow,
  showPopularQuery,
} from '$lib/requests/queries/shows/showPopularQuery.ts';
import { derived } from 'svelte/store';
import type { MediaType } from '../../../requests/models/MediaType.ts';

export type PopularEntry = PopularShow | MovieEntry;
export type PopularMediaList = Array<PopularEntry>;

type PopularListStoreProps = {
  type: MediaType;
  limit?: number;
  page?: number;
};

function typeToQuery(
  { type, limit, page }: PopularListStoreProps,
) {
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
  const query = useQuery(typeToQuery(props));

  return {
    list: derived(query, ($query) => $query.data?.entries ?? []),
    page: derived(
      query,
      ($query) => $query.data?.page ?? { page: 0, total: 0 },
    ),
  };
}
