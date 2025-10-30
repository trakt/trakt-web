import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { ShowTrendingResponse } from '@trakt/api';
import { z } from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { getRecordDependencies } from '../../_internal/getRecordDependencies.ts';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import type { SearchParams } from '../../models/SearchParams.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

export const TrendingShowSchema = ShowEntrySchema
  .extend({
    watchers: z.number(),
  });
export type TrendingShow = z.infer<typeof TrendingShowSchema>;

type ShowTrendingParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

export function mapToTrendingShow({
  watchers,
  show,
}: ShowTrendingResponse): TrendingShow {
  return {
    watchers,
    ...mapToShowEntry(show),
  };
}

export const showTrendingRequest = (
  { fetch, limit, page, filter, filterOverride, search }: ShowTrendingParams,
) => {
  const filterParams = filterOverride?.show ?? filter;

  return api({ fetch })
    .shows
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

export const showTrendingQuery = defineQuery({
  key: 'showTrending',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: (
    params,
  ) => [
    params.limit,
    params.page,
    ...getGlobalFilterDependencies(
      params.filterOverride?.show ?? params.filter,
    ),
    ...getRecordDependencies(params.search),
  ],
  request: showTrendingRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToTrendingShow),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(TrendingShowSchema),
  ttl: time.hours(1),
});
