import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import { getRecordDependencies } from '../../_internal/getRecordDependencies.ts';

type ShowPopularParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

const showPopularRequest = (
  { fetch, limit, page, filter, search }: ShowPopularParams,
) =>
  api({ fetch })
    .shows
    .popular({
      query: {
        extended: 'full,images,colors',
        page,
        limit,
        ...filter,
        ...search,
      },
    });

export const showPopularQuery = defineQuery({
  key: 'showPopular',
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
    ...getGlobalFilterDependencies(params.filter),
    ...getRecordDependencies(params.search),
  ],
  request: showPopularRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToShowEntry),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(ShowEntrySchema),
  ttl: time.hours(1),
});
