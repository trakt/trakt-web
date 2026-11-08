import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { anticipatedRecommendationsRequest } from '$lib/requests/_internal/anticipatedRecommendationsRequest.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { RecommendationsMovieResponseSchema } from '$lib/requests/models/RecommendationsResponse.ts';
import { time } from '$lib/utils/timing/time.ts';

type AnticipatedRecommendedMoviesParams = PaginationParams &
  ApiParams &
  FilterParams;

const anticipatedRecommendedMoviesRequest = (
  params: AnticipatedRecommendedMoviesParams,
) =>
  anticipatedRecommendationsRequest({
    ...params,
    path: '/movies/recommendations/anticipated',
    schema: RecommendationsMovieResponseSchema,
  });

export const anticipatedRecommendedMoviesQuery = defineInfiniteQuery({
  key: 'anticipatedRecommendedMovies',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (params: AnticipatedRecommendedMoviesParams) => [
    params.limit,
    params.page,
    params.filter?.watch_window,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: anticipatedRecommendedMoviesRequest,
  mapper: (response) => ({
    entries: response.body.map((item) => mapToMovieEntry(item.movie)),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MovieEntrySchema),
  ttl: time.hours(3),
});
