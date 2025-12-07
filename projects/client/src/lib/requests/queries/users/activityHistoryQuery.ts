import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { ActivityHistoryResponse } from '@trakt/api';
import { z } from 'zod';
import type { PaginationParams } from '../../models/PaginationParams.ts';
import {
  EpisodeActivityHistorySchema,
  mapToEpisodeActivityHistory,
} from './episodeActivityHistoryQuery.ts';
import {
  mapToMovieActivityHistory,
  MovieActivityHistorySchema,
} from './movieActivityHistoryQuery.ts';

type ActivityHistoryParams =
  & {
    slug: string;
    startDate?: Date;
    endDate?: Date;
  }
  & ApiParams
  & PaginationParams;

const HistorySchema = z.discriminatedUnion('type', [
  EpisodeActivityHistorySchema,
  MovieActivityHistorySchema,
]);
export type ActivityHistory = z.infer<typeof HistorySchema>;

function activityHistoryRequest(
  { fetch, slug, startDate, endDate, limit, page }: ActivityHistoryParams,
) {
  return api({ fetch })
    .users
    .history
    .all({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,images',
        start_at: startDate?.toISOString(),
        end_at: endDate?.toISOString(),
        limit,
        page,
      },
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

export const activityHistoryQuery = defineInfiniteQuery({
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
    params.slug,
  ],
  request: activityHistoryRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToActivityHistory),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(HistorySchema),
  ttl: time.hours(1),
});
