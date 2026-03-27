import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
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
import type { FavoriteMovieResponse, FavoriteShowResponse } from '@trakt/api';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { mapToFavoriteMovie } from '../movies/movieFavoritesQuery.ts';
import { mapToFavoriteShow } from '../shows/showFavoritesQuery.ts';

type FavoriteMediaParams =
  & {
    slug: string;
    sortBy?: SortBy;
    sortHow?: SortDirection;
  }
  & PaginationParams
  & ApiParams
  & FilterParams;

const favoritedMediaRequest = (
  { fetch, slug, limit, page, filter, sortBy, sortHow }: FavoriteMediaParams,
) =>
  api({ fetch })
    .users
    .favorites
    .media({
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

function mapToFavoriteEntry(
  entry: FavoriteMovieResponse | FavoriteShowResponse,
): FavoritedEntry {
  return 'movie' in entry
    ? mapToFavoriteMovie(entry)
    : mapToFavoriteShow(entry);
}

export const mediaFavoritesQuery = defineInfiniteQuery({
  key: 'mediaFavorites',
  invalidations: [
    InvalidateAction.Favorited('movie'),
    InvalidateAction.Favorited('show'),
  ],
  dependencies: (params) => [
    params.slug,
    params.limit,
    params.page,
    params.sortBy,
    params.sortHow,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: favoritedMediaRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToFavoriteEntry),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(FavoritedEntrySchema),
  ttl: time.hours(1),
});
