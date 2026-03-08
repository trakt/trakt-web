import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { movieFavoritesQuery } from '$lib/requests/queries/movies/movieFavoritesQuery.ts';
import { showFavoritesQuery } from '$lib/requests/queries/shows/showFavoritesQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, map } from 'rxjs';
type UseFavoritesProps = {
  type?: DiscoverMode;
  slug: string;
} & FilterParams;

function typeToQueries(
  { type, slug, filter }: UseFavoritesProps,
) {
  switch (type) {
    case 'movie':
      return [movieFavoritesQuery({ slug, filter })];
    case 'show':
      return [showFavoritesQuery({ slug, filter })];
    default:
      return [
        movieFavoritesQuery({ slug, filter }),
        showFavoritesQuery({ slug, filter }),
      ];
  }
}

export function useFavoritesList({ type, slug, filter }: UseFavoritesProps) {
  const queries = typeToQueries({ type, slug, filter })
    .map((query) => useQuery(query));

  return {
    list: combineLatest(queries).pipe(
      map(($queries) => {
        const favorites = $queries.flatMap((query) => query.data ?? []);
        return type !== undefined
          ? favorites.toSorted((a, b) => b.rank - a.rank)
          : favorites;
      }),
    ),
    isLoading: combineLatest(queries).pipe(
      map(($queries) => $queries.some(toLoadingState)),
    ),
  };
}
