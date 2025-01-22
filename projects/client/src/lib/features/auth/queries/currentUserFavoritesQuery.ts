import type {
  FavoritedMoviesResponse,
  FavoritedShowsResponse,
} from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import { z } from 'zod';
import { api, type ApiParams } from '../../../requests/_internal/api.ts';

const UserFavoritedMediaSchema = z.object({
  favoritedAt: z.date(),
  id: z.number(),
});

export type UserFavoritedEntry = z.infer<typeof UserFavoritedMediaSchema>;

function mapFavoritedMovieResponse(
  entry: FavoritedMoviesResponse,
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
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error('Error fetching user favorited movies', response);
        /**
         * TODO: define error handling strategy/system
         */
        throw new Error('Error fetching user favorited movies.');
      }

      return response.body;
    });

function mapFavoritedShowResponse(
  entry: FavoritedShowsResponse,
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
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error('Error fetching user favorited shows', response);
        /**
         * TODO: define error handling strategy/system
         */
        throw new Error('Error fetching user favorited shows.');
      }

      return response.body;
    });

const UserFavoritesSchema = z.object({
  movies: z.map(z.number(), UserFavoritedMediaSchema),
  shows: z.map(z.number(), UserFavoritedMediaSchema),
});
export type UserFavorites = z.infer<typeof UserFavoritesSchema>;
export const currentUserFavoritesQuery = await defineQuery({
  key: 'currentUserFavorites',
  request: () =>
    Promise.all([
      favoritedMoviesRequest({ fetch }),
      favoritedShowsRequest({ fetch }),
    ]),
  invalidations: [
    InvalidateAction.Favorited('movie'),
    InvalidateAction.Favorited('show'),
  ],
  dependencies: [],
  mapper: ([movies, shows]) => {
    return {
      movies: toMap(movies, mapFavoritedMovieResponse, (entry) => entry.id),
      shows: toMap(shows, mapFavoritedShowResponse, (entry) => entry.id),
    };
  },
  schema: UserFavoritesSchema,
});
