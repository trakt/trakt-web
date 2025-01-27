import { useQuery } from '$lib/features/query/useQuery';
import type { MediaType } from '$lib/requests/models/MediaType';
import {
  type AnticipatedMovie,
  movieAnticipatedQuery,
} from '$lib/requests/queries/movies/movieAnticipatedQuery.ts';
import { showAnticipatedQuery } from '$lib/requests/queries/shows/showAnticipatedQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState';
import { derived } from 'svelte/store';

export type AnticipatedEntry = AnticipatedMovie;
export type AnticipatedMediaList = Array<AnticipatedEntry>;

type AnticipatedListStoreProps = {
  type: MediaType;
  limit?: number;
  page?: number;
};

function typeToQuery(
  { type, limit, page }: AnticipatedListStoreProps,
) {
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
  const query = useQuery(typeToQuery(props));

  const isLoading = derived(
    query,
    toLoadingState,
  );

  return {
    isLoading,
    list: derived(query, ($query) => $query.data?.entries ?? []),
    page: derived(
      query,
      ($query) => $query.data?.page ?? { page: 0, total: 0 },
    ),
  };
}
