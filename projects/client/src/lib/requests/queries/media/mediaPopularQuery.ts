import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';

import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { getRecordDependencies } from '../../_internal/getRecordDependencies.ts';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

type MediaPopularParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

const PopularMediaSchema = z.union([ShowEntrySchema, MovieEntrySchema]);

const mediaPopularRequest = (
  { fetch, limit, page, filter, filterOverride, search }: MediaPopularParams,
) => {
  const filterParams = filterOverride?.show ?? filter;

  return api({ fetch })
    .media
    .popular({
      query: {
        extended: 'full,images,colors',
        page,
        limit,
        ...filterParams,
        ...search,
      },
    });
};

export const mediaPopularQuery = defineInfiniteQuery({
  key: 'mediaPopular',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params: MediaPopularParams,
  ) => [
    params.limit,
    params.page,
    ...getGlobalFilterDependencies(
      params.filterOverride?.movie ?? params.filter,
    ),
    ...getRecordDependencies(params.search),
  ],
  request: mediaPopularRequest,
  mapper: (response) => ({
    entries: response.body.map((entry) =>
      'aired_episodes' in entry ? mapToShowEntry(entry) : mapToMovieEntry(entry)
    ),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(PopularMediaSchema),
  ttl: time.hours(1),
});
