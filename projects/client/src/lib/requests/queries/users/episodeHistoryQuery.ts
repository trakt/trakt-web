import type { HistoryEpisodesResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapEpisodeResponseToEpisodeEntry } from '$lib/requests/_internal/mapEpisodeResponseToEpisodeEntry.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { api, type ApiParams } from '$lib/requests/api';
import { EpisodeEntrySchema } from '$lib/requests/models/EpisodeEntry';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry';
import { time } from '$lib/utils/timing/time';
import { z } from 'zod';

type EpisodeHistoryParams = {
  startDate: Date;
  endDate: Date;
  limit: number;
} & ApiParams;

const HistoryEpisodeSchema = z.object({
  id: z.number(),
  watchedAt: z.date(),
  show: ShowEntrySchema,
  episode: EpisodeEntrySchema,
});
type HistoryEpisode = z.infer<typeof HistoryEpisodeSchema>;

function episodeHistoryRequest(
  { fetch, startDate, endDate, limit }: EpisodeHistoryParams,
) {
  return api({ fetch })
    .users
    .history
    .episodes({
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
        throw new Error('Failed to fetch episodes history');
      }

      return body;
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
  };
}

export const episodeHistoryQuery = defineQuery({
  key: 'episodeHistory',
  invalidations: [InvalidateAction.MarkAsWatched('episode')],
  dependencies: (params) => [
    params.startDate,
    params.endDate,
    params.limit,
  ],
  request: episodeHistoryRequest,
  mapper: (body) => body.map(mapResponseToHistory),
  schema: HistoryEpisodeSchema.array(),
  ttl: time.hours(1),
});
