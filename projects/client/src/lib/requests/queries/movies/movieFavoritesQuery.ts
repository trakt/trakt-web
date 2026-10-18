import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import {
  type FavoritedEntry,
  FavoritedEntrySchema,
} from '$lib/requests/models/FavoritedEntry.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SortBy } from '$lib/sections/lists/user/models/SortBy.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { FavoriteMovieResponse } from '@trakt/api';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';

type FavoriteMoviesParams = {
  slug: string;
  sortBy?: SortBy;
  sortHow?: SortDirection;
} & PaginationParams &
  ApiParams &
  FilterParams;

const favoritedMoviesRequest = ({
  fetch,
  slug,
  limit,
  page,
  filter,
  sortBy,
  sortHow,
}: FavoriteMoviesParams) =>
  api({ fetch }).users.favorites.movies({
    params: {
      id: slug,
    },
    query: {
      extended: 'full,images,colors',
      sort_by: sortBy ?? 'added',
      sort_how: sortHow ?? 'desc',
      page,
      limit,
      ...filter,
    },
  });

export function mapToFavoriteMovie(
  entry: FavoriteMovieResponse,
): FavoritedEntry {
  return {
    key: `movie-${entry.movie.ids.trakt}`,
    favoritedAt: new Date(entry.listed_at),
    rank: entry.rank,
    item: mapToMovieEntry(entry.movie),
  };
}

export const movieFavoritesQuery = defineInfiniteQuery({
  key: 'movieFavorites',
  invalidations: [InvalidateAction.Favorited('movie')],
  dependencies: (params) => [
    params.slug,
    params.limit,
    params.page,
    params.sortBy,
    params.sortHow,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: favoritedMoviesRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToFavoriteMovie),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(FavoritedEntrySchema),
  ttl: time.hours(1),
});
