import type { MediaType } from '$lib/models/MediaType';
import type { FavoritedMedia } from '$lib/requests/models/FavoritedMedia';
import { movieFavoritesQuery } from '$lib/requests/queries/movies/movieFavoritesQuery';
import { showFavoritesQuery } from '$lib/requests/queries/shows/showFavoritesQuery';
import { time } from '$lib/utils/timing/time';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

type UseFavoritesProps = {
  type: MediaType;
};

function typeToQuery(
  { type }: UseFavoritesProps,
): CreateQueryOptions<FavoritedMedia[]> {
  switch (type) {
    case 'movie':
      return movieFavoritesQuery({});
    case 'show':
      return showFavoritesQuery({});
  }
}

export function useFavoritesList({ type }: UseFavoritesProps) {
  const query = createQuery({
    ...typeToQuery({ type }),
    staleTime: time.hours(1),
  });

  return {
    list: derived(query, ($query) => $query.data ?? []),
    isLoading: derived(
      query,
      ($query) => $query.isLoading || $query.isFetching,
    ),
  };
}
