import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { movieFavoritesQuery } from '$lib/requests/queries/movies/movieFavoritesQuery.ts';
import { showFavoritesQuery } from '$lib/requests/queries/shows/showFavoritesQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

type UseFavoritesProps = {
  type: MediaType;
  slug: string;
};

function typeToQuery(
  { type, slug }: UseFavoritesProps,
) {
  switch (type) {
    case 'movie':
      return movieFavoritesQuery({ slug });
    case 'show':
      return showFavoritesQuery({ slug });
  }
}

export function useFavoritesList({ type, slug }: UseFavoritesProps) {
  const query = useQuery(typeToQuery({ type, slug }));

  return {
    list: derived(query, ($query) => $query.data ?? []),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
}
