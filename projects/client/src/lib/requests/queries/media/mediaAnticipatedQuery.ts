import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { getRecordDependencies } from '$lib/requests/_internal/getRecordDependencies.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import { weave } from '$lib/utils/array/weave.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';
import {
  AnticipatedMovieSchema,
  mapToAnticipatedMovie,
  movieAnticipatedRequest,
} from '../movies/movieAnticipatedQuery.ts';
import {
  AnticipatedShowSchema,
  mapToAnticipatedShow,
  showAnticipatedRequest,
} from '../shows/showAnticipatedQuery.ts';

type MediaAnticipatedParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

const AnticipatedMediaSchema = z.union([
  AnticipatedMovieSchema,
  AnticipatedShowSchema,
]);

export const mediaAnticipatedQuery = defineInfiniteQuery({
  key: 'mediaAnticipated',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params: MediaAnticipatedParams,
  ) => [
    params.limit,
    params.page,
    ...getGlobalFilterDependencies(
      params.filterOverride?.movie ?? params.filter,
    ),
    ...getRecordDependencies(params.search),
  ],
  request: (params) =>
    Promise.all([
      showAnticipatedRequest(params),
      movieAnticipatedRequest(params),
    ]),
  mapper: ([showsResponse, moviesResponse]) => {
    const shows = showsResponse.body.map(mapToAnticipatedShow);
    const movies = moviesResponse.body.map(mapToAnticipatedMovie);

    return {
      entries: weave(shows, movies),
      page: extractPageMeta(showsResponse.headers),
    };
  },
  schema: PaginatableSchemaFactory(AnticipatedMediaSchema),
  ttl: time.hours(3),
});
