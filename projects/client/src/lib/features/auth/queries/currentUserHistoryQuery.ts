import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import { error } from '$lib/utils/console/print.ts';
import type { WatchedMoviesResponse, WatchedShowsResponse } from '@trakt/api';
import { z } from 'zod';
import { api, type ApiParams } from '../../../requests/api.ts';

export const MediaPlayHistorySchema = z.object({
  watchedAt: z.date(),
  plays: z.number(),
});
export type MediaPlayHistory = z.infer<typeof MediaPlayHistorySchema>;

const WatchedMediaSchema = MediaPlayHistorySchema.extend({
  id: z.number(),
});

const WatchMovieSchema = WatchedMediaSchema;
export type WatchedMovie = z.infer<typeof WatchMovieSchema>;

function mapWatchedMovieResponse(
  entry: WatchedMoviesResponse[0],
): WatchedMovie {
  const { last_watched_at, plays, movie } = entry;
  return {
    id: movie.ids.trakt,
    watchedAt: new Date(last_watched_at),
    plays,
  };
}

const currentUserWatchedMoviesRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .watched
    .movies({
      params: { id: 'me' },
    })
    .then((response) => {
      if (response.status !== 200) {
        error('Error fetching user movie history', response);
        throw new Error('Error fetching user movie history.');
      }
      return response.body;
    });

export const WatchedEpisodeSchema = MediaPlayHistorySchema.extend({
  season: z.number(),
  episode: z.number(),
});
export type WatchedEpisode = z.infer<typeof WatchedEpisodeSchema>;

export const WatchedShowSchema = WatchedMediaSchema.extend({
  episodes: z.array(WatchedEpisodeSchema),
  isWatched: z.boolean(),
});
export type WatchedShow = z.infer<typeof WatchedShowSchema>;

function mapWatchedShowResponse(entry: WatchedShowsResponse[0]): WatchedShow {
  const { show, last_watched_at, plays, seasons = [] } = entry;
  const aired = entry.show.aired_episodes;

  const episodes = seasons
    .filter((season) => season.number !== 0)
    .flatMap((season) =>
      season.episodes.map((episode) => ({
        season: season.number,
        episode: episode.number,
        watchedAt: new Date(episode.last_watched_at),
        plays: episode.plays,
      }))
    );

  return {
    id: show.ids.trakt,
    watchedAt: new Date(last_watched_at),
    isWatched: episodes.length === aired,
    plays,
    episodes,
  };
}

const currentUserWatchedShowsRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .watched
    .shows({
      params: { id: 'me' },
    })
    .then((response) => {
      if (response.status !== 200) {
        error('Error fetching user show history', response);
        throw new Error('Error fetching user show history.');
      }
      return response.body;
    });

const UserHistorySchema = z.object({
  movies: z.map(z.number(), WatchMovieSchema),
  shows: z.map(z.number(), WatchedShowSchema),
});
export type UserHistory = z.infer<typeof UserHistorySchema>;

export const currentUserHistoryQuery = defineQuery({
  key: 'currentUserHistory',
  request: () =>
    Promise.all([
      currentUserWatchedMoviesRequest({ fetch }),
      currentUserWatchedShowsRequest({ fetch }),
    ]),
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: [],
  mapper: ([movies, shows]) => ({
    movies: toMap(movies, mapWatchedMovieResponse, (entry) => entry.id),
    shows: toMap(shows, mapWatchedShowResponse, (entry) => entry.id),
  }),
  schema: UserHistorySchema,
  ttl: Infinity,
});
