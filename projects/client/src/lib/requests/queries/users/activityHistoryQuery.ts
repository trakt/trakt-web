import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import type { FilterParams } from '../../models/FilterParams.ts';
import type { PaginationParams } from '../../models/PaginationParams.ts';
import {
  episodeActivityHistoryRequest,
  EpisodeActivityHistorySchema,
  mapToEpisodeActivityHistory,
} from './episodeActivityHistoryQuery.ts';
import {
  mapToMovieActivityHistory,
  movieActivityHistoryRequest,
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

export const activityHistoryQuery = defineInfiniteQuery({
  key: 'activityHistory',
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
  request: (params) =>
    Promise.all([
      movieActivityHistoryRequest(params),
      episodeActivityHistoryRequest(params),
    ]),
  mapper: ([movieResponse, episodeResponse]) => {
    const movies = movieResponse.body.map(mapToMovieActivityHistory);
    const episodes = episodeResponse.body.map(mapToEpisodeActivityHistory);

    const watched = [...movies, ...episodes].toSorted((a, b) =>
      b.watchedAt.getTime() - a.watchedAt.getTime()
    );

    return {
      entries: watched,
      page: extractPageMeta(episodeResponse.headers),
    };
  },
  schema: PaginatableSchemaFactory(HistorySchema),
  ttl: time.hours(1),
});
