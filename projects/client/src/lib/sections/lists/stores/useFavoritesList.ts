import { useQuery } from '$lib/features/query/useQuery';
import type { MediaType } from '$lib/requests/models/MediaType';
import { movieFavoritesQuery } from '$lib/requests/queries/movies/movieFavoritesQuery';
import { showFavoritesQuery } from '$lib/requests/queries/shows/showFavoritesQuery';
import { toLoadingState } from '$lib/utils/requests/toLoadingState';
import { time } from '$lib/utils/timing/time';
import { derived } from 'svelte/store';

type UseFavoritesProps = {
  type: MediaType;
};

function typeToQuery(
  { type }: UseFavoritesProps,
) {
  switch (type) {
    case 'movie':
      return movieFavoritesQuery({});
    case 'show':
      return showFavoritesQuery({});
  }
}

export function useFavoritesList({ type }: UseFavoritesProps) {
  const query = useQuery({
    ...typeToQuery({ type }),
    staleTime: time.hours(1),
  });

  return {
    list: derived(query, ($query) => $query.data ?? []),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
}
