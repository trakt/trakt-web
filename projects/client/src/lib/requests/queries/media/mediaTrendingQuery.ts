import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { getRecordDependencies } from '../../_internal/getRecordDependencies.ts';
import type { SearchParams } from '../../models/SearchParams.ts';
import {
  mapToTrendingMovie,
  TrendingMovieSchema,
} from '../movies/movieTrendingQuery.ts';
import {
  mapToTrendingShow,
  TrendingShowSchema,
} from '../shows/showTrendingQuery.ts';

type MediaTrendingParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

const TrendingMediaSchema = z.union([TrendingShowSchema, TrendingMovieSchema]);

const mediaTrendingRequest = (
  { fetch, limit, page, filter, filterOverride, search }: MediaTrendingParams,
) => {
  const filterParams = filterOverride?.show ?? filter;

  return api({ fetch })
    .media
    .trending({
      query: {
        extended: 'full,images,colors',
        page,
        limit,
        ...filterParams,
        ...search,
      },
    });
};

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
  request: mediaTrendingRequest,
  mapper: (response) => ({
    entries: response.body.map((entry) =>
      'show' in entry ? mapToTrendingShow(entry) : mapToTrendingMovie(entry)
    ),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(TrendingMediaSchema),
  ttl: time.hours(1),
});
