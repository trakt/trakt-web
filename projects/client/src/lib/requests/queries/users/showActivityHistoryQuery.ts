import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import {
  type EpisodeActivityHistory,
  EpisodeActivityHistorySchema,
} from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { ShowActivityHistoryResponse } from '@trakt/api';

type ShowActivityHistoryParams = {
  limit: number;
  slug: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  id?: number;
} & ApiParams;

// Show history responses are per episode
export type ShowActivityHistory = EpisodeActivityHistory;

const showHistoryRequest = (
  { fetch, slug, startDate, endDate, limit, id, page = 1 }:
    ShowActivityHistoryParams,
) => {
  const queryParams = {
    extended: 'full,images' as const,
    start_at: startDate?.toISOString(),
    end_at: endDate?.toISOString(),
    limit,
    page,
  };

  return id
    ? api({ fetch }).users.history.show({
      params: { id: slug, item_id: `${id}` },
      query: queryParams,
    })
    : api({ fetch }).users.history.shows({
      params: { id: slug },
      query: queryParams,
    });
};

const mapToShowActivityHistory = (
  historyShow: ShowActivityHistoryResponse,
) => ({
  id: historyShow.id,
  watchedAt: new Date(historyShow.watched_at),
  episode: {
    ...mapToEpisodeEntry(historyShow.episode),
    show: mapToShowEntry(historyShow.show),
  },
  type: 'episode' as const,
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
    params.id,
    params.slug,
  ],
  request: showHistoryRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToShowActivityHistory),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(EpisodeActivityHistorySchema),
  ttl: time.hours(6),
});
