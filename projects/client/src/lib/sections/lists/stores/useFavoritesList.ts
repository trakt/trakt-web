import { useQuery } from '$lib/features/query/useQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { movieFavoritesQuery } from '$lib/requests/queries/movies/movieFavoritesQuery.ts';
import { showFavoritesQuery } from '$lib/requests/queries/shows/showFavoritesQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

type UseFavoritesProps = {
  type: MediaType;
  slug: string;
} & FilterParams;

function typeToQuery(
  { type, slug, filter }: UseFavoritesProps,
) {
  switch (type) {
    case 'movie':
      return movieFavoritesQuery({ slug, filter });
    case 'show':
      return showFavoritesQuery({ slug, filter });
  }
}

export function useFavoritesList({ type, slug, filter }: UseFavoritesProps) {
  const query = useQuery(typeToQuery({ type, slug, filter }));

  return {
    list: derived(query, ($query) => $query.data ?? []),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
}
