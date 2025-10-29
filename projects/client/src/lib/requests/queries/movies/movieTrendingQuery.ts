import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { MovieTrendingResponse } from '@trakt/api';
import { z } from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { getRecordDependencies } from '../../_internal/getRecordDependencies.ts';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';

export const TrendingMovieSchema = MovieEntrySchema.extend({
  watchers: z.number(),
});
export type TrendingMovie = z.infer<typeof TrendingMovieSchema>;

type MovieTrendingParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

function mapToTrendingMovie({
  watchers,
  movie,
}: MovieTrendingResponse): TrendingMovie {
  return {
    watchers,
    ...mapToMovieEntry(movie),
  };
}

const movieTrendingRequest = (
  { fetch, limit, page, filter, filterOverride, search }: MovieTrendingParams,
) => {
  const filterParams = filterOverride?.movie ?? filter;

  return api({ fetch })
    .movies
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

export const movieTrendingQuery = defineQuery({
  key: 'movieTrending',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params,
  ) => [
    params.limit,
    params.page,
    ...getGlobalFilterDependencies(
      params.filterOverride?.movie ?? params.filter,
    ),
    ...getRecordDependencies(params.search),
  ],
  request: movieTrendingRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToTrendingMovie),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(TrendingMovieSchema),
  ttl: time.hours(1),
});
