import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { FavoriteMovieResponse } from '@trakt/api';
import {
  type FavoritedEntry,
  FavoritedEntrySchema,
} from '../../models/FavoritedEntry.ts';

const favoritedMoviesRequest = (
  { fetch }: ApiParams,
) =>
  api({ fetch })
    .users
    .favorites
    .movies({
      params: {
        id: 'me',
        sort: 'rank',
      },
      query: {
        extended: 'full,images',
      },
    });

function mapToFavoriteMovie(
  entry: FavoriteMovieResponse,
): FavoritedEntry {
  return {
    id: entry.movie.ids.trakt,
    favoritedAt: new Date(entry.listed_at),
    item: mapToMovieEntry(entry.movie),
  };
}

export const movieFavoritesQuery = defineQuery({
  key: 'movieFavorites',
  invalidations: [InvalidateAction.Favorited('movie')],
  dependencies: () => [],
  request: favoritedMoviesRequest,
  mapper: (response) => response.body.map(mapToFavoriteMovie),
  schema: FavoritedEntrySchema.array(),
  ttl: time.hours(1),
});
