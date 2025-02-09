import type { ListedMovieResponse, ListedShowResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import { error } from '$lib/utils/console/print.ts';
import { z } from 'zod';
import { api, type ApiParams } from '../../../requests/api.ts';

export const WatchlistedMediaSchema = z.object({
  id: z.number(),
  watchlistedAt: z.date(),
});
export type WatchlistedEntry = z.infer<typeof WatchlistedMediaSchema>;

const WatchlistedMovieSchema = WatchlistedMediaSchema;
export type WatchlistedMovie = z.infer<typeof WatchlistedMovieSchema>;

function mapWatchlistedMovieResponse(
  entry: ListedMovieResponse,
): WatchlistedMovie {
  const { listed_at, movie } = entry;
  return {
    id: movie.ids.trakt,
    watchlistedAt: new Date(listed_at),
  };
}

const currentUserWatchlistedMoviesRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .watchlist
    .movies({
      params: {
        id: 'me',
        sort: 'rank',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        error('Error fetching user movie watchlist', response);
        throw new Error('Error fetching user movie watchlist.');
      }
      return response.body;
    });

const WatchlistedShowSchema = WatchlistedMediaSchema;
export type WatchlistedShow = z.infer<typeof WatchlistedShowSchema>;

function mapWatchlistedShowResponse(
  entry: ListedShowResponse,
): WatchlistedShow {
  const { listed_at, show } = entry;
  return {
    id: show.ids.trakt,
    watchlistedAt: new Date(listed_at),
  };
}

const currentUserWatchlistedShowsRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .watchlist
    .shows({
      params: {
        id: 'me',
        sort: 'rank',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        error('Error fetching user show watchlist', response);
        throw new Error('Error fetching user show watchlist.');
      }
      return response.body;
    });

const UserWatchlistSchema = z.object({
  movies: z.map(z.number(), WatchlistedMovieSchema),
  shows: z.map(z.number(), WatchlistedShowSchema),
});
export type UserWatchlist = z.infer<typeof UserWatchlistSchema>;

export const currentUserWatchlistQuery = defineQuery({
  key: 'currentUserWatchlist',
  request: () =>
    Promise.all([
      currentUserWatchlistedMoviesRequest({ fetch }),
      currentUserWatchlistedShowsRequest({ fetch }),
    ]),
  invalidations: [
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.Watchlisted('movie'),
  ],
  dependencies: [],
  mapper: ([movies, shows]) => ({
    movies: toMap(movies, mapWatchlistedMovieResponse, (entry) => entry.id),
    shows: toMap(shows, mapWatchlistedShowResponse, (entry) => entry.id),
  }),
  schema: UserWatchlistSchema,
  ttl: Infinity,
});
