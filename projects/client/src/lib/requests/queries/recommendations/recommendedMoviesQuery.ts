import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LimitParams } from '$lib/requests/models/LimitParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { getRecommendedSearchParams } from '../../_internal/getRecommendedSearchParams.ts';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';
import {
  type RecommendationsMovieResponse,
  RecommendationsMovieResponseSchema,
} from '../../models/RecommendationsResponse.ts';

export { RecommendationsMovieResponseSchema };
export type { RecommendationsMovieResponse };

export const RecommendedMovieSchema = MovieEntrySchema;
export type RecommendedMovie = z.infer<typeof RecommendedMovieSchema>;

type RecommendedMoviesParams = LimitParams & ApiParams & FilterParams;

export const recommendedMoviesRequest = async (
  { fetch, limit, filter, filterOverride }: RecommendedMoviesParams,
) => {
  const filterParams = filterOverride?.movie ?? filter;
  const searchParams = getRecommendedSearchParams({ limit, filterParams });

  const response = await rawApiFetch({
    fetch,
    path: `/movies/recommendations?${searchParams}`,
  });

  return response.ok
    ? {
      body: RecommendationsMovieResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const recommendedMoviesQuery = defineQuery({
  key: 'recommendedMovies',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params,
  ) => [
    params.limit,
    params.filter?.watch_window,
    ...getGlobalFilterDependencies(
      params.filterOverride?.movie ?? params.filter,
    ),
  ],
  request: recommendedMoviesRequest,
  mapper: (response) =>
    response.body?.map((item) => mapToMovieEntry(item.movie)) ?? [],
  schema: RecommendedMovieSchema.array(),
  ttl: time.hours(24),
});
