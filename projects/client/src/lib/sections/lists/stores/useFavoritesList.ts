import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { mediaFavoritesQuery } from '$lib/requests/queries/media/mediaFavoritesQuery.ts';
import { movieFavoritesQuery } from '$lib/requests/queries/movies/movieFavoritesQuery.ts';
import { showFavoritesQuery } from '$lib/requests/queries/shows/showFavoritesQuery.ts';
import type { SortBy } from '$lib/sections/lists/user/models/SortBy.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { usePaginatedListQuery } from './usePaginatedListQuery.ts';

type UseFavoritesProps = {
  type?: DiscoverMode;
  slug: string;
  limit?: number;
  sortBy?: SortBy;
  sortHow?: SortDirection;
} & FilterParams;

function typeToQuery(
  { type, slug, filter, limit, sortBy, sortHow }: UseFavoritesProps & {
    limit: number;
  },
) {
  const params = { slug, filter, limit, sortBy, sortHow };

  switch (type) {
    case 'movie':
      return movieFavoritesQuery(params);
    case 'show':
      return showFavoritesQuery(params);
    default:
      return mediaFavoritesQuery(params);
  }
}

export function useFavoritesList(
  { type, slug, filter, limit = DEFAULT_PAGE_SIZE, sortBy, sortHow }:
    UseFavoritesProps,
) {
  return usePaginatedListQuery(
    typeToQuery({ type, slug, filter, limit, sortBy, sortHow }),
  );
}
