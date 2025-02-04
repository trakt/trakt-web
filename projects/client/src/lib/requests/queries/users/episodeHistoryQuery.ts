import type { HistoryEpisodesResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapEpisodeResponseToEpisodeEntry } from '$lib/requests/_internal/mapEpisodeResponseToEpisodeEntry.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeEntrySchema } from '$lib/requests/models/EpisodeEntry.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

type EpisodeHistoryParams = {
  startDate: Date;
  endDate: Date;
  limit: number;
  page?: number;
} & ApiParams;

const HistoryEpisodeSchema = z.object({
  id: z.number(),
  watchedAt: z.date(),
  show: ShowEntrySchema,
  episode: EpisodeEntrySchema,
  type: z.literal('episode'),
});
export type HistoryEpisode = z.infer<typeof HistoryEpisodeSchema>;

function episodeHistoryRequest(
  { fetch, startDate, endDate, limit, page = 1 }: EpisodeHistoryParams,
) {
  return api({ fetch })
    .users
    .history
    .episodes({
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
        throw new Error('Failed to fetch episodes history');
      }

      return response;
    });
}

function mapResponseToHistory(
  historyEpisode: HistoryEpisodesResponse,
): HistoryEpisode {
  return {
    id: historyEpisode.id,
    watchedAt: new Date(historyEpisode.watched_at),
    show: mapShowResponseToShowSummary(historyEpisode.show),
    episode: mapEpisodeResponseToEpisodeEntry(historyEpisode.episode),
    type: 'episode' as const,
  };
}

export const episodeHistoryQuery = defineQuery({
  key: 'episodeHistory',
  invalidations: [InvalidateAction.MarkAsWatched('episode')],
  dependencies: (params) => [
    params.startDate,
    params.endDate,
    params.limit,
    params.page,
  ],
  request: episodeHistoryRequest,
  mapper: (response) => ({
    entries: response.body.map(mapResponseToHistory),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(HistoryEpisodeSchema),
  ttl: time.hours(1),
});
