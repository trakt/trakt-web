import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { anticipatedRecommendationsRequest } from '$lib/requests/_internal/anticipatedRecommendationsRequest.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { RecommendationsShowResponseSchema } from '$lib/requests/models/RecommendationsResponse.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';

type AnticipatedRecommendedShowsParams = PaginationParams &
  ApiParams &
  FilterParams;

const anticipatedRecommendedShowsRequest = (
  params: AnticipatedRecommendedShowsParams,
) =>
  anticipatedRecommendationsRequest({
    ...params,
    path: '/shows/recommendations/anticipated',
    schema: RecommendationsShowResponseSchema,
  });

export const anticipatedRecommendedShowsQuery = defineInfiniteQuery({
  key: 'anticipatedRecommendedShows',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.HideRecommended('show'),
  ],
  dependencies: (params: AnticipatedRecommendedShowsParams) => [
    params.limit,
    params.page,
    params.filter?.watch_window,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: anticipatedRecommendedShowsRequest,
  mapper: (response) => ({
    entries: response.body.map((item) => mapToShowEntry(item.show)),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(ShowEntrySchema),
  ttl: time.hours(3),
});
