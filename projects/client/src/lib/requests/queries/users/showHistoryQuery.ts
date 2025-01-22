import type { HistoryShowsResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapEpisodeResponseToEpisodeEntry } from '$lib/requests/_internal/mapEpisodeResponseToEpisodeEntry.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { z } from 'zod';
import { api, type ApiParams } from '../../_internal/api.ts';
import { EpisodeEntrySchema } from '../../models/EpisodeEntry';
import { ShowEntrySchema } from '../../models/ShowEntry';

type ShowHistoryParams = {
  startDate: Date;
  endDate: Date;
  limit: number;
} & ApiParams;

const HistoryShowSchema = z.object({
  id: z.number(),
  watchedAt: z.date(),
  show: ShowEntrySchema,
  episode: EpisodeEntrySchema,
});
export type HistoryShow = z.infer<typeof HistoryShowSchema>;

const showHistoryRequest = (
  { fetch, startDate, endDate, limit }: ShowHistoryParams,
) =>
  api({ fetch })
    .users
    .history
    .shows({
      params: {
        id: 'me',
      },
      query: {
        extended: 'full,cloud9',
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        limit,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch shows history');
      }

      return body;
    });

const mapResponseToHistory = (
  historyShow: HistoryShowsResponse,
) => ({
  id: historyShow.id,
  watchedAt: new Date(historyShow.watched_at),
  show: mapShowResponseToShowSummary(historyShow.show),
  episode: mapEpisodeResponseToEpisodeEntry(historyShow.episode),
});

export const showHistoryQuery = await defineQuery({
  key: 'showHistory',
  invalidations: [InvalidateAction.MarkAsWatched('show')],
  dependencies: (params: ShowHistoryParams) => [
    params.startDate,
    params.endDate,
    params.limit,
  ],
  request: showHistoryRequest,
  mapper: (body) => body.map(mapResponseToHistory),
  schema: HistoryShowSchema.array(),
});
