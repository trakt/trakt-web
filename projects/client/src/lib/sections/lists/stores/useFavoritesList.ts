import { useQuery } from '$lib/features/query/useQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { movieFavoritesQuery } from '$lib/requests/queries/movies/movieFavoritesQuery.ts';
import { showFavoritesQuery } from '$lib/requests/queries/shows/showFavoritesQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

type UseFavoritesProps = {
  type?: MediaType;
  slug: string;
} & FilterParams;

function typeToQueries(
  { type, slug, filter }: UseFavoritesProps,
) {
  if (!type) {
    return [
      movieFavoritesQuery({ slug, filter }),
      showFavoritesQuery({ slug, filter }),
    ];
  }

  switch (type) {
    case 'movie':
      return [movieFavoritesQuery({ slug, filter })];
    case 'show':
      return [showFavoritesQuery({ slug, filter })];
  }
}

export function useFavoritesList({ type, slug, filter }: UseFavoritesProps) {
  const queries = typeToQueries({ type, slug, filter })
    .map((query) => useQuery(query));

  return {
    list: derived(queries, ($queries) => {
      const favorites = $queries.flatMap((query) => query.data ?? []);
      return type !== undefined
        ? favorites.sort((a, b) => b.rank - a.rank)
        : favorites;
    }),
    isLoading: derived(
      queries,
      ($queries) => $queries.some(toLoadingState),
    ),
  };
}
