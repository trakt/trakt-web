import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
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
    });

export const WatchedEpisodeSchema = MediaPlayHistorySchema.extend({
  season: z.number(),
  episode: z.number(),
});
export type WatchedEpisode = z.infer<typeof WatchedEpisodeSchema>;

export const WatchedShowSchema = WatchedMediaSchema.extend({
  episodes: z.array(WatchedEpisodeSchema),
  isWatched: z.boolean(),
  isPartiallyWatched: z.boolean(),
});
export type WatchedShow = z.infer<typeof WatchedShowSchema>;

function mapWatchedShowResponse(entry: WatchedShowsResponse[0]): WatchedShow {
  const { show, last_watched_at, plays, seasons = [] } = entry;
  const aired = entry.show.aired_episodes;

  const episodes = (seasons ?? [])
    .flatMap((season) =>
      season.episodes.map((episode) => ({
        season: season.number,
        episode: episode.number,
        watchedAt: new Date(episode.last_watched_at),
        plays: episode.plays,
      }))
    );

  const watchedEpisodeCount = episodes
    .filter(({ season }) => season !== 0)
    .length;

  return {
    id: show.ids.trakt,
    watchedAt: new Date(last_watched_at),
    isWatched: watchedEpisodeCount === aired,
    isPartiallyWatched: watchedEpisodeCount > 0,
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
      query: { specials: true },
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
  mapper: ([moviesResponse, showsResponse]) => ({
    movies: toMap(
      moviesResponse.body,
      mapWatchedMovieResponse,
      (entry) => entry.id,
    ),
    shows: toMap(
      showsResponse.body,
      mapWatchedShowResponse,
      (entry) => entry.id,
    ),
  }),
  schema: UserHistorySchema,
  ttl: Infinity,
});
