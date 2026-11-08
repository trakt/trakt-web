import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { anticipatedRecommendationsRequest } from '$lib/requests/_internal/anticipatedRecommendationsRequest.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { RecommendationsResponseSchema } from '$lib/requests/models/RecommendationsResponse.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

type MediaAnticipatedRecommendedParams = PaginationParams &
  ApiParams &
  FilterParams;

const AnticipatedRecommendedMediaSchema = z.union([
  ShowEntrySchema,
  MovieEntrySchema,
]);

const mediaAnticipatedRecommendedRequest = (
  params: MediaAnticipatedRecommendedParams,
) =>
  anticipatedRecommendationsRequest({
    ...params,
    path: '/media/recommendations/anticipated',
    schema: RecommendationsResponseSchema,
  });

export const mediaAnticipatedRecommendedQuery = defineInfiniteQuery({
  key: 'mediaAnticipatedRecommended',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.HideRecommended('show'),
    InvalidateAction.HideRecommended('movie'),
  ],
  dependencies: (params: MediaAnticipatedRecommendedParams) => [
    params.limit,
    params.page,
    params.filter?.watch_window,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: mediaAnticipatedRecommendedRequest,
  mapper: (response) => ({
    entries: response.body.map((item) =>
      'movie' in item ? mapToMovieEntry(item.movie) : mapToShowEntry(item.show),
    ),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(AnticipatedRecommendedMediaSchema),
  ttl: time.hours(3),
});
