import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { getRecordDependencies } from '$lib/requests/_internal/getRecordDependencies.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { MovieAnticipatedResponse } from '@trakt/api';
import { z } from 'zod';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';

export const AnticipatedMovieSchema = MovieEntrySchema.extend({
  score: z.number(),
});
export type AnticipatedMovie = z.infer<typeof AnticipatedMovieSchema>;

type MovieAnticipatedParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

export function mapToAnticipatedMovie({
  list_count,
  movie,
}: MovieAnticipatedResponse): AnticipatedMovie {
  return {
    score: list_count,
    ...mapToMovieEntry(movie),
  };
}

const movieAnticipatedRequest = (
  { fetch, limit, page, filter, filterOverride, search }:
    MovieAnticipatedParams,
) => {
  const filterParams = filterOverride?.movie ?? filter;

  return api({ fetch })
    .movies
    .anticipated({
      query: {
        extended: 'full,images,colors',
        page,
        limit,
        ...filterParams,
        ...search,
      },
    });
};

export const movieAnticipatedQuery = defineInfiniteQuery({
  key: 'movieAnticipated',
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
  request: movieAnticipatedRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToAnticipatedMovie),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(AnticipatedMovieSchema),
  ttl: time.hours(3),
});
