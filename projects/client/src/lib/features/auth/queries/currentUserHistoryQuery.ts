import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { z } from 'zod';
import { api, type ApiParams } from '../../../requests/api.ts';
import { time } from '../../../utils/timing/time.ts';

export const MediaPlayHistorySchema = z.object({
  watchedAt: z.date(),
  plays: z.number(),
});
export type MediaPlayHistory = z.infer<typeof MediaPlayHistorySchema>;

const WatchedMediaSchema = MediaPlayHistorySchema.extend({
  id: z.number(),
});

const WatchMovieSchema = WatchedMediaSchema.extend({
  watchedDates: z.array(z.date()),
});
export type WatchedMovie = z.infer<typeof WatchMovieSchema>;

function getLastWatchedAt(timestamps: string[]): Date {
  const lastWatchedAt = assertDefined(
    timestamps.toSorted().at(-1),
    'Expected at least one timestamp',
  );

  return new Date(lastWatchedAt);
}

function mapWatchedMovieResponse(
  [id, timestamps]: [string, string[]],
): WatchedMovie {
  return {
    id: Number(id),
    watchedAt: getLastWatchedAt(timestamps),
    plays: timestamps.length,
    watchedDates: timestamps.map((t) => new Date(t)),
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
  episodeId: z.number(),
});
export type WatchedEpisode = z.infer<typeof WatchedEpisodeSchema>;

export const WatchedShowSchema = WatchedMediaSchema.omit({ plays: true })
  .extend({
    episodes: z.array(WatchedEpisodeSchema),
    watchedDates: z.array(z.date()),
    playsPerSeason: z.map(z.number(), z.number()),
  });
export type WatchedShow = z.infer<typeof WatchedShowSchema>;

function mapWatchedShowResponse(
  [showId, seasons]: [string, Record<string, Record<string, string[]>>],
): WatchedShow {
  const id = Number(showId);

  const episodes = Object.entries(seasons)
    .flatMap(([seasonId, episodeMap]) =>
      Object.entries(episodeMap).map(([episodeId, timestamps]) => {
        const seasonNumber = Number(
          assertDefined(
            seasonId.split('|').at(1),
            'Expected season key to contain season number',
          ),
        );

        return {
          season: seasonNumber,
          episodeId: Number(episodeId),
          watchedAt: getLastWatchedAt(timestamps),
          plays: timestamps.length,
        };
      })
    );

  const playsPerSeason = episodes.reduce(
    (acc, { season }) => acc.set(season, (acc.get(season) ?? 0) + 1),
    new Map<number, number>(),
  );

  const watchedDates = episodes.map((episode) => episode.watchedAt);
  const watchedAt = watchedDates.reduce(
    (max, date) => date > max ? date : max,
    new Date(0),
  );

  return {
    id,
    watchedAt,
    episodes,
    watchedDates,
    playsPerSeason,
  };
}

const currentUserWatchedShowsRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .watched
    .minimal
    .shows({
      params: { id: 'me' },
      query: {
        specials: true,
        extended: 'min',
        season_numbers: true,
      },
    });

const UserHistorySchema = z.object({
  movies: z.map(z.number(), WatchMovieSchema),
  shows: z.map(z.number(), WatchedShowSchema),
  lastWatchedAt: z.date().nullable(),
});
export type UserHistory = z.infer<typeof UserHistorySchema>;

export const currentUserHistoryQuery = defineQuery({
  key: 'currentUserHistory',
  request: (params) =>
    Promise.all([
      currentUserWatchedMoviesRequest(params),
      currentUserWatchedShowsRequest(params),
    ]),
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: [],
  mapper: ([moviesResponse, showsResponse]) => {
    const movies = toMap(
      Object.entries(moviesResponse.body),
      mapWatchedMovieResponse,
      (entry) => entry.id,
    );
    const shows = toMap(
      Object.entries(showsResponse.body),
      mapWatchedShowResponse,
      (entry) => entry.id,
    );

    const lastWatchedAt = [...movies.values(), ...shows.values()].reduce<
      Date | null
    >(
      (max, { watchedAt }) => max === null || watchedAt > max ? watchedAt : max,
      null,
    );

    return { movies, shows, lastWatchedAt };
  },
  schema: UserHistorySchema,
  ttl: time.hours(12),
});
