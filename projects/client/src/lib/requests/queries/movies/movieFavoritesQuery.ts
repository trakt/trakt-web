import type { FavoritedMoviesResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/_internal/api';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
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
        extended: 'full,cloud9',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Error fetching user favorited movies.');
      }

      return response.body;
    });

function mapFavoritedMovieResponse(
  entry: FavoritedMoviesResponse,
): FavoritedEntry {
  return {
    id: entry.movie.ids.trakt,
    favoritedAt: new Date(entry.listed_at),
    item: mapMovieResponseToMovieSummary(entry.movie),
  };
}

export const movieFavoritesQuery = defineQuery({
  key: 'movieFavorites',
  invalidations: [InvalidateAction.Favorited('movie')],
  dependencies: () => [],
  request: favoritedMoviesRequest,
  mapper: (data) => data.map(mapFavoritedMovieResponse),
  schema: FavoritedEntrySchema.array(),
});
