import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import {
  type FavoritedEntry,
  FavoritedEntrySchema,
} from '$lib/requests/models/FavoritedEntry.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { FavoriteMovieResponse } from '@trakt/api';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';

type FavoriteMoviesParams =
  & {
    slug: string;
  }
  & ApiParams
  & FilterParams;

const favoritedMoviesRequest = (
  { fetch, slug, filter }: FavoriteMoviesParams,
) =>
  api({ fetch })
    .users
    .favorites
    .movies({
      params: {
        id: slug,
        sort: 'rank',
      },
      query: {
        extended: 'full,images,colors',
        ...filter,
      },
    });

function mapToFavoriteMovie(
  entry: FavoriteMovieResponse,
): FavoritedEntry {
  return {
    id: entry.movie.ids.trakt,
    favoritedAt: new Date(entry.listed_at),
    rank: entry.rank,
    item: mapToMovieEntry(entry.movie),
  };
}

export const movieFavoritesQuery = defineQuery({
  key: 'movieFavorites',
  invalidations: [InvalidateAction.Favorited('movie')],
  dependencies: (params) => [
    params.slug,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: favoritedMoviesRequest,
  mapper: (response) => response.body.map(mapToFavoriteMovie),
  schema: FavoritedEntrySchema.array(),
  ttl: time.hours(1),
});
