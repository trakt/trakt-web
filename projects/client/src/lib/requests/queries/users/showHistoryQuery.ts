import type { HistoryShowsResponse } from '$lib/api.ts';
import { authHeader } from '$lib/features/auth/stores/authHeader.ts';
import type { EpisodeEntry } from '$lib/models/EpisodeEntry.ts';
import { mapEpisodeResponseToEpisodeEntry } from '$lib/requests/_internal/mapEpisodeResponseToEpisodeEntry.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type ShowHistoryParams = {
  startDate: Date;
  endDate: Date;
  limit: number;
} & ApiParams;

export type HistoryShow = {
  id: number;
  watchedAt: Date;
  show: ShowSummary;
  episode: EpisodeEntry;
};

export function mapResponseToHistory(
  historyShow: HistoryShowsResponse,
): HistoryShow {
  return {
    id: historyShow.id,
    watchedAt: new Date(historyShow.watched_at),
    show: mapShowResponseToShowSummary(historyShow.show),
    episode: mapEpisodeResponseToEpisodeEntry(historyShow.episode),
  };
}

function showHistoryRequest(
  { fetch, startDate, endDate, limit }: ShowHistoryParams,
): Promise<HistoryShow[]> {
  return api({ fetch })
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
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch shows history');
      }

      return body.map(mapResponseToHistory);
    });
}

const showHistoryQueryKey = [
  'showHistoryQuery',
  InvalidateAction.MarkAsWatched('show'),
] as const;
export const showHistoryQuery = (
  params: ShowHistoryParams,
) => ({
  queryKey: showHistoryQueryKey,
  queryFn: () => showHistoryRequest(params),
});
