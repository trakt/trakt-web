import type { ShowActivityHistoryResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { EpisodeEntrySchema } from '../../models/EpisodeEntry.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

type ShowActivityHistoryParams = {
  startDate: Date;
  endDate: Date;
  limit: number;
  page?: number;
} & ApiParams;

const ShowActivityHistorySchema = z.object({
  id: z.number(),
  watchedAt: z.date(),
  show: ShowEntrySchema,
  episode: EpisodeEntrySchema,
  type: z.literal('show'),
});
export type ShowActivityHistory = z.infer<typeof ShowActivityHistorySchema>;

const showHistoryRequest = (
  { fetch, startDate, endDate, limit, page = 1 }: ShowActivityHistoryParams,
) =>
  api({ fetch })
    .users
    .history
    .shows({
      params: {
        id: 'me',
      },
      query: {
        extended: 'full,images',
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        limit,
        page,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch shows history');
      }

      return response;
    });

const mapToShowActivityHistory = (
  historyShow: ShowActivityHistoryResponse,
) => ({
  id: historyShow.id,
  watchedAt: new Date(historyShow.watched_at),
  show: mapToShowEntry(historyShow.show),
  episode: mapToEpisodeEntry(historyShow.episode),
  type: 'show' as const,
});

export const showActivityHistoryQuery = defineQuery({
  key: 'showActivityHistory',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: (params: ShowActivityHistoryParams) => [
    params.startDate,
    params.endDate,
    params.limit,
    params.page,
  ],
  request: showHistoryRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToShowActivityHistory),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(ShowActivityHistorySchema),
  ttl: time.hours(6),
});
