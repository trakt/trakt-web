import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LimitParams } from '$lib/requests/models/LimitParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { RecommendedShowResponse } from '@trakt/api';
import { z } from 'zod';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

export const RecommendedShowSchema = ShowEntrySchema;
export type RecommendedShow = z.infer<typeof RecommendedShowSchema>;

type RecommendedShowsParams = LimitParams & ApiParams & FilterParams;

const recommendedShowsRequest = (
  { fetch, limit, filter, filterOverride }: RecommendedShowsParams,
) => {
  const filterParams = filterOverride?.show ?? filter;

  return api({ fetch })
    .recommendations
    .shows
    .recommend({
      query: {
        extended: 'full,images,colors',
        ignore_collected: true,
        limit,
        ...filterParams,
        // FIXME: remove when we have tri-state filter toggles
        ignore_watched: true,
      },
    });
};

export const recommendedShowsQuery = defineQuery({
  key: 'recommendedShows',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
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
    response.body.map((show: RecommendedShowResponse[0]) =>
      mapToShowEntry(show)
    ),
  schema: RecommendedShowSchema.array(),
  ttl: time.hours(24),
});
