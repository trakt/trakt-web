import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { getRecordDependencies } from '$lib/requests/_internal/getRecordDependencies.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import { time } from '$lib/utils/timing/time.ts';

type MoviePopularParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

const moviePopularRequest = (
  { fetch, limit, page, filter, filterOverride, search }: MoviePopularParams,
) => {
  const filterParams = filterOverride?.movie ?? filter;

  return api({ fetch })
    .movies
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

export const moviePopularQuery = defineQuery({
  key: 'moviePopular',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params,
  ) => [
    params.limit,
    params.page,
    ...getGlobalFilterDependencies(
      params.filterOverride?.movie ?? params.filter,
    ),
    ...getRecordDependencies(params.search),
  ],
  request: moviePopularRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToMovieEntry),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MovieEntrySchema),
  ttl: time.hours(1),
});
