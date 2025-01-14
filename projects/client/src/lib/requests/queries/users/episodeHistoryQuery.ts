import type { HistoryEpisodesResponse } from '$lib/api.ts';
import type { EpisodeEntry } from '$lib/models/EpisodeEntry.ts';
import { mapEpisodeResponseToEpisodeEntry } from '$lib/requests/_internal/mapEpisodeResponseToEpisodeEntry.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type EpisodeHistoryParams = {
  startDate: Date;
  endDate: Date;
  limit: number;
} & ApiParams;

export type HistoryEpisode = {
  id: number;
  watchedAt: Date;
  show: ShowSummary;
  episode: EpisodeEntry;
};

export function mapResponseToHistory(
  historyEpisode: HistoryEpisodesResponse,
): HistoryEpisode {
  return {
    id: historyEpisode.id,
    watchedAt: new Date(historyEpisode.watched_at),
    show: mapShowResponseToShowSummary(historyEpisode.show),
    episode: mapEpisodeResponseToEpisodeEntry(historyEpisode.episode),
  };
}

function episodeHistoryRequest(
  { fetch, startDate, endDate, limit }: EpisodeHistoryParams,
): Promise<HistoryEpisode[]> {
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

      return body.map(mapResponseToHistory);
    });
}

const episodeHistoryQueryKey = [
  'episodeHistoryQuery',
  InvalidateAction.MarkAsWatched('episode'),
] as const;
export const episodeHistoryQuery = (
  params: EpisodeHistoryParams,
) => ({
  queryKey: episodeHistoryQueryKey,
  queryFn: () => episodeHistoryRequest(params),
});
