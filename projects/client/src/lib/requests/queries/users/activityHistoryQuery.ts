import type { ActivityHistoryResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import {
  EpisodeActivityHistorySchema,
  mapToEpisodeActivityHistory,
} from './episodeActivityHistoryQuery.ts';
import {
  mapToMovieActivityHistory,
  MovieActivityHistorySchema,
} from './movieActivityHistoryQuery.ts';

type ActivityHistoryParams = {
  limit: number;
  startDate?: Date;
  endDate?: Date;
  page?: number;
} & ApiParams;

const HistorySchema = z.discriminatedUnion('type', [
  EpisodeActivityHistorySchema,
  MovieActivityHistorySchema,
]);
export type ActivityHistory = z.infer<typeof HistorySchema>;

function activityHistoryRequest(
  { fetch, startDate, endDate, limit, page = 1 }: ActivityHistoryParams,
) {
  return api({ fetch })
    .users
    .history
    .all({
      params: {
        id: 'me',
      },
      query: {
        extended: 'full,images',
        start_at: startDate?.toISOString(),
        end_at: endDate?.toISOString(),
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

function mapToActivityHistory(
  activity: ActivityHistoryResponse,
): ActivityHistory {
  switch (activity.type) {
    case 'episode':
      return mapToEpisodeActivityHistory(activity);
    case 'movie':
      return mapToMovieActivityHistory(activity);
  }
}

export const activityHistoryQuery = defineQuery({
  key: 'activityHistory',
  invalidations: [
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.MarkAsWatched('show'),
  ],
  dependencies: (params) => [
    params.startDate,
    params.endDate,
    params.limit,
    params.page,
  ],
  request: activityHistoryRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToActivityHistory),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(HistorySchema),
  ttl: time.hours(1),
});
