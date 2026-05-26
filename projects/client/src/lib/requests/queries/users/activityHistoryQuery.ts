import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { time } from '$lib/utils/timing/time.ts';
import type {
  ActivityHistoryResponse,
  EpisodeActivityHistoryResponse,
  MovieActivityHistoryResponse,
} from '@trakt/api';
import { z } from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import type { FilterParams } from '../../models/FilterParams.ts';
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
  & PaginationParams
  & FilterParams;

const HistorySchema = z.discriminatedUnion('type', [
  EpisodeActivityHistorySchema,
  MovieActivityHistorySchema,
]);
export type ActivityHistory = z.infer<typeof HistorySchema>;

export function activityHistoryRequest(
  { fetch, slug, startDate, endDate, limit, page, filter }:
    ActivityHistoryParams,
) {
  const queryParams = {
    extended: 'full,images' as const,
    start_at: startDate?.toISOString(),
    end_at: endDate?.toISOString(),
    limit,
    page,
    ...filter,
  };

  return api({ fetch }).users.history.all({
    params: { id: slug },
    query: queryParams,
  });
}

type ValidHistoryItemResponse =
  | MovieActivityHistoryResponse
  | EpisodeActivityHistoryResponse;

function isValidHistoryItemResponse(
  response: ActivityHistoryResponse,
): response is ValidHistoryItemResponse {
  return (response.type === 'movie' && Boolean(response.movie)) ||
    (response.type === 'episode' && Boolean(response.episode));
}

export const activityHistoryQuery = defineInfiniteQuery({
  key: 'activityHistory:v2',
  invalidations: [
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.MarkAsWatched('show'),
  ],
  dependencies: (params: ActivityHistoryParams) => [
    params.startDate,
    params.endDate,
    params.limit,
    params.page,
    params.slug,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: activityHistoryRequest,
  mapper: (response) => ({
    entries: response.body
      .filter(isValidHistoryItemResponse)
      .map((item) =>
        item.type === 'movie'
          ? mapToMovieActivityHistory(item)
          : mapToEpisodeActivityHistory(item)
      ),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(HistorySchema),
  ttl: time.hours(1),
});
