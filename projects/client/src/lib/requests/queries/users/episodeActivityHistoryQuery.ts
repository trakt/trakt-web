import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeEntrySchema } from '$lib/requests/models/EpisodeEntry.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { EpisodeActivityHistoryResponse } from '@trakt/api';
import { z } from 'zod';

type EpisodeActivityHistoryParams = {
  limit: number;
  slug: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  id?: number;
} & ApiParams;

export const EpisodeActivityHistorySchema = z.object({
  id: z.number(),
  watchedAt: z.date(),
  episode: EpisodeEntrySchema.merge(z.object({
    show: ShowEntrySchema,
  })),
  type: z.literal('episode'),
});
export type EpisodeActivityHistory = z.infer<
  typeof EpisodeActivityHistorySchema
>;

function episodeActivityHistoryRequest(
  { fetch, slug, startDate, endDate, limit, id, page = 1 }:
    EpisodeActivityHistoryParams,
) {
  const queryParams = {
    extended: 'full,images' as const,
    start_at: startDate?.toISOString(),
    end_at: endDate?.toISOString(),
    limit,
    page,
  };

  return id
    ? api({ fetch }).users.history.episode({
      params: { id: slug, item_id: `${id}` },
      query: queryParams,
    })
    : api({ fetch }).users.history.episodes({
      params: { id: slug },
      query: queryParams,
    });
}

export function mapToEpisodeActivityHistory(
  historyEpisode: EpisodeActivityHistoryResponse,
): EpisodeActivityHistory {
  return {
    id: historyEpisode.id,
    watchedAt: new Date(historyEpisode.watched_at),
    episode: {
      ...mapToEpisodeEntry(historyEpisode.episode),
      show: mapToShowEntry(historyEpisode.show),
    },
    type: 'episode' as const,
  };
}

export const episodeActivityHistoryQuery = defineQuery({
  key: 'episodeHistory',
  invalidations: [
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.MarkAsWatched('show'),
  ],
  dependencies: (params) => [
    params.startDate,
    params.endDate,
    params.limit,
    params.page,
    params.id,
    params.slug,
  ],
  request: episodeActivityHistoryRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToEpisodeActivityHistory),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(EpisodeActivityHistorySchema),
  ttl: time.hours(1),
});
