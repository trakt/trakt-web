import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LimitParams } from '$lib/requests/models/LimitParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { getRecommendedSearchParams } from '../../_internal/getRecommendedSearchParams.ts';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import {
  type RecommendationsShowResponse,
  RecommendationsShowResponseSchema,
} from '../../models/RecommendationsResponse.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

export { RecommendationsShowResponseSchema };
export type { RecommendationsShowResponse };

export const RecommendedShowSchema = ShowEntrySchema;
export type RecommendedShow = z.infer<typeof RecommendedShowSchema>;

type RecommendedShowsParams = LimitParams & ApiParams & FilterParams;

export const recommendedShowsRequest = async (
  { fetch, limit, filter, filterOverride }: RecommendedShowsParams,
) => {
  const filterParams = filterOverride?.show ?? filter;
  const searchParams = getRecommendedSearchParams({ limit, filterParams });

  const response = await rawApiFetch({
    fetch,
    path: `/shows/recommendations?${searchParams}`,
  });

  return response.ok
    ? {
      body: RecommendationsShowResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const recommendedShowsQuery = defineQuery({
  key: 'recommendedShows',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.HideRecommended('show'),
  ],
  dependencies: (
    params,
  ) => [
    params.limit,
    params.filter?.watch_window,
    ...getGlobalFilterDependencies(
      params.filterOverride?.show ?? params.filter,
    ),
  ],
  request: recommendedShowsRequest,
  mapper: (response) =>
    response.body?.map((item) => mapToShowEntry(item.show)) ?? [],
  schema: RecommendedShowSchema.array(),
  ttl: time.hours(24),
});
