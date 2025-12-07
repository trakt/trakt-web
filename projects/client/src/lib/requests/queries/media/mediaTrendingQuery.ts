import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { weave } from '$lib/utils/array/weave.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { getRecordDependencies } from '../../_internal/getRecordDependencies.ts';
import type { SearchParams } from '../../models/SearchParams.ts';
import {
  mapToTrendingMovie,
  movieTrendingRequest,
  TrendingMovieSchema,
} from '../movies/movieTrendingQuery.ts';
import {
  mapToTrendingShow,
  showTrendingRequest,
  TrendingShowSchema,
} from '../shows/showTrendingQuery.ts';

type MediaTrendingParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

const TrendingMediaSchema = z.union([TrendingShowSchema, TrendingMovieSchema]);
export const mediaTrendingQuery = defineInfiniteQuery({
  key: 'mediaTrending',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params: MediaTrendingParams,
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
      showTrendingRequest(params),
      movieTrendingRequest(params),
    ]),
  mapper: ([showsResponse, moviesResponse]) => {
    const movies = moviesResponse.body.map(mapToTrendingMovie);
    const shows = showsResponse.body.map(mapToTrendingShow);

    return {
      entries: weave(shows, movies),
      page: extractPageMeta(showsResponse.headers),
    };
  },
  schema: PaginatableSchemaFactory(TrendingMediaSchema),
  ttl: time.hours(1),
});
