import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import type { FavoriteMovieResponse, FavoriteShowResponse } from '@trakt/api';
import { z } from 'zod';
import { api, type ApiParams } from '../../../requests/api.ts';

const UserFavoritedMediaSchema = z.object({
  favoritedAt: z.date(),
  id: z.number(),
});

export type UserFavoritedEntry = z.infer<typeof UserFavoritedMediaSchema>;

function mapMovie(
  entry: FavoriteMovieResponse,
): UserFavoritedEntry {
  return {
    id: entry.movie.ids.trakt,
    favoritedAt: new Date(entry.listed_at),
  };
}

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
    });

function mapShow(
  entry: FavoriteShowResponse,
): UserFavoritedEntry {
  return {
    id: entry.show.ids.trakt,
    favoritedAt: new Date(entry.listed_at),
  };
}

const favoritedShowsRequest = (
  { fetch }: ApiParams,
) =>
  api({ fetch })
    .users
    .favorites
    .shows({
      params: {
        id: 'me',
        sort: 'rank',
      },
    });

const UserFavoritesSchema = z.object({
  movies: z.map(z.number(), UserFavoritedMediaSchema),
  shows: z.map(z.number(), UserFavoritedMediaSchema),
});
export type UserFavorites = z.infer<typeof UserFavoritesSchema>;
export const currentUserFavoritesQuery = defineQuery({
  key: 'currentUserFavorites',
  request: (params) =>
    Promise.all([
      favoritedMoviesRequest(params),
      favoritedShowsRequest(params),
    ]),
  invalidations: [
    InvalidateAction.Favorited('movie'),
    InvalidateAction.Favorited('show'),
  ],
  dependencies: [],
  mapper: ([movieResponse, showResponse]) => {
    return {
      movies: toMap(
        movieResponse.body,
        mapMovie,
        (entry) => entry.id,
      ),
      shows: toMap(
        showResponse.body,
        mapShow,
        (entry) => entry.id,
      ),
    };
  },
  schema: UserFavoritesSchema,
  ttl: Infinity,
});
