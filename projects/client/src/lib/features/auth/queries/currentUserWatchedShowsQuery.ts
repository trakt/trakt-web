import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { z } from 'zod';
import { api, type ApiParams } from '../../../requests/api.ts';
import { time } from '../../../utils/timing/time.ts';
import {
  MediaPlayHistorySchema,
  WatchedMediaSchema,
} from './_internal/WatchedHistorySchema.ts';
import { getLastWatchedAt } from './_internal/getLastWatchedAt.ts';

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

export function mapWatchedShowResponse(
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

type CurrentUserWatchedShowsParams = PaginationParams & ApiParams;

const currentUserWatchedShowsRequest = (
  { fetch, page = 1, limit }: CurrentUserWatchedShowsParams,
) => {
  const pagination = {
    page,
    limit,
  };

  return api({ fetch })
    .users
    .watched
    .minimal
    .shows({
      params: { id: 'me' },
      query: {
        specials: true,
        extended: 'min',
        season_numbers: true,
        ...pagination,
      },
    });
};

export const currentUserWatchedShowsQuery = defineInfiniteQuery({
  key: 'currentUserWatchedShows',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: (params) => [params.limit],
  request: currentUserWatchedShowsRequest,
  mapper: (response, { page = 1 }) => ({
    entries: Object.entries(response.body).map(mapWatchedShowResponse),
    page: extractPageMeta(response.headers, page),
  }),
  schema: PaginatableSchemaFactory(WatchedShowSchema),
  ttl: time.hours(12),
});
