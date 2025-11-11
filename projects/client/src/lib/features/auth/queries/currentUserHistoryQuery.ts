import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import type { WatchedShowsResponse } from '@trakt/api';
import { z } from 'zod';
import { api, type ApiParams } from '../../../requests/api.ts';
import { MAX_DATE } from '../../../utils/constants.ts';

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
  [id, timestamps]: [string, string[]],
): WatchedMovie {
  const lastWatchedAt = timestamps.toSorted().at(-1);

  return {
    id: Number(id),
    watchedAt: new Date(lastWatchedAt ?? MAX_DATE),
    plays: timestamps.length,
  };
}

const currentUserWatchedMoviesRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .watched
    .minimal
    .movies({
      params: { id: 'me' },
      query: {
        extended: 'min',
      },
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
  const { show, last_watched_at, seasons = [] } = entry;
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

  const regularEpisodes = episodes.filter(
    ({ season }) => season !== 0,
  );

  const watchedEpisodeCount = regularEpisodes.length;
  const isWatched = watchedEpisodeCount >= aired;

  // FIXME: move this logic to the backend
  const plays = isWatched
    ? Math.min(...regularEpisodes.map((episode) => episode.plays))
    : 0;

  return {
    id: show.ids.trakt,
    watchedAt: new Date(last_watched_at),
    isPartiallyWatched: watchedEpisodeCount > 0 && watchedEpisodeCount < aired,
    isWatched,
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
      Object.entries(moviesResponse.body),
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
