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
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import {
  type RecommendationsResponse,
  RecommendationsResponseSchema,
} from '../../models/RecommendationsResponse.ts';
import {
  RecommendedMovieSchema,
} from '../recommendations/recommendedMoviesQuery.ts';
import {
  RecommendedShowSchema,
} from '../recommendations/recommendedShowsQuery.ts';

export { RecommendationsResponseSchema };
export type { RecommendationsResponse };

type RecommendedMediaParams = LimitParams & ApiParams & FilterParams;

const RecommendedMediaSchema = z.union([
  RecommendedShowSchema,
  RecommendedMovieSchema,
]);

const recommendedMediaRequest = async (
  { fetch, limit, filter, filterOverride }: RecommendedMediaParams,
) => {
  const filterParams = filterOverride?.movie ?? filterOverride?.show ?? filter;
  const searchParams = getRecommendedSearchParams({ limit, filterParams });

  // FIXME: move to @trakt/api when we drop support for legacy recommendations
  const response = await rawApiFetch({
    fetch,
    path: `/media/recommendations?${searchParams}`,
  });

  return response.ok
    ? {
      body: RecommendationsResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const recommendedMediaQuery = defineQuery({
  key: 'recommendedMedia',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.HideRecommended('show'),
    InvalidateAction.HideRecommended('movie'),
  ],
  dependencies: (
    params: RecommendedMediaParams,
  ) => [
    params.limit,
    params.filter?.watch_window,
    ...getGlobalFilterDependencies(
      params.filterOverride?.movie ?? params.filter,
    ),
  ],
  request: recommendedMediaRequest,
  mapper: (response) =>
    response.body?.map((item) =>
      'movie' in item ? mapToMovieEntry(item.movie) : mapToShowEntry(item.show)
    ) ?? [],
  schema: RecommendedMediaSchema.array(),
  ttl: time.hours(24),
});
