import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeProgressEntrySchema } from '$lib/requests/models/EpisodeProgressEntry.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import { type UpNextIntentRequest, type UpNextResponse } from '@trakt/api';
import { z } from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { mapToEpisodeEntry } from '../../_internal/mapToEpisodeEntry.ts';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import type { FilterParams } from '../../models/FilterParams.ts';

export const UpNextEntryNitroSchema = EpisodeProgressEntrySchema.merge(
  z.object({
    show: ShowEntrySchema,
    lastWatchedAt: z.date().nullable(),
  }),
);
export type UpNextEntry = z.infer<typeof UpNextEntryNitroSchema>;

type UpNextParams =
  & PaginationParams
  & ApiParams
  & UpNextIntentRequest
  & FilterParams;

export function mapUpNextResponse(item: UpNextResponse): UpNextEntry {
  const show = mapToShowEntry(item.show);
  const episode = mapToEpisodeEntry(item.progress.next_episode);
  episode.runtime = isNaN(episode.runtime) ? show.runtime : episode.runtime;

  return {
    show,
    ...episode,
    total: item.progress.aired,
    completed: item.progress.completed,
    remaining: item.progress.aired - item.progress.completed,
    minutesLeft: item.progress.stats?.minutes_left ?? 0,
    lastWatchedAt: item.progress.last_watched_at
      ? new Date(item.progress.last_watched_at)
      : null,
  };
}

export const upNextNitroRequest = (params: UpNextParams) => {
  const { fetch, limit, page, intent, filter } = params;

  return api({ fetch })
    .sync
    .progress
    .upNext
    .nitro({
      query: {
        page,
        limit,
        intent,
        ...filter,
      },
    });
};

export const upNextNitroQuery = defineInfiniteQuery({
  key: 'upNext',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Drop('show'),
    InvalidateAction.Restore,
    InvalidateAction.Watchlisted('show'),
  ],
  dependencies: (
    params: UpNextParams,
  ) => [
    params.page,
    params.limit,
    params.intent,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: upNextNitroRequest,
  mapper: (response) => ({
    entries: response.body.map(mapUpNextResponse),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(UpNextEntryNitroSchema),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
