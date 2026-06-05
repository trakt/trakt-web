import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { getRecordDependencies } from '$lib/requests/_internal/getRecordDependencies.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { ShowAnticipatedResponse } from '@trakt/api';
import { z } from 'zod';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';

export const AnticipatedShowSchema = ShowEntrySchema
  .extend({
    score: z.number(),
  });
export type AnticipatedShow = z.infer<typeof AnticipatedShowSchema>;

type ShowAnticipatedParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

export function mapToAnticipatedShow({
  list_count,
  show,
}: ShowAnticipatedResponse): AnticipatedShow {
  const { aired_episodes } = show;
  const episodeCount = aired_episodes && aired_episodes > 0
    ? { episode: { count: aired_episodes } }
    : {};

  return {
    score: list_count,
    ...mapToShowEntry(show),
    ...episodeCount,
  };
}

export const showAnticipatedRequest = (
  { fetch, limit, page, filter, filterOverride, search }: ShowAnticipatedParams,
) => {
  const filterParams = filterOverride?.show ?? filter;

  return api({ fetch })
    .shows
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

export const showAnticipatedQuery = defineInfiniteQuery({
  key: 'showAnticipated',
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
  request: showAnticipatedRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToAnticipatedShow),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(AnticipatedShowSchema),
  ttl: time.hours(3),
});
