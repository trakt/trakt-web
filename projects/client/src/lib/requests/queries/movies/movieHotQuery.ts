import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { MovieHotResponse } from '@trakt/api';
import { z } from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { getRecordDependencies } from '../../_internal/getRecordDependencies.ts';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';

export const HotMovieSchema = MovieEntrySchema.extend({
  score: z.number(),
});
export type HotMovie = z.infer<typeof HotMovieSchema>;

type MovieHotParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

function mapToHotMovie({
  list_count,
  movie,
}: MovieHotResponse): HotMovie {
  return {
    score: list_count,
    ...mapToMovieEntry(movie),
  };
}

const movieHotRequest = (
  { fetch, limit, page, filter, search }: MovieHotParams,
) =>
  api({ fetch })
    .movies
    .hot({
      query: {
        extended: 'full,images,colors',
        page,
        limit,
        ...filter,
        ...search,
        start_date: 'lastmonth',
      },
    });

export const movieHotQuery = defineQuery({
  key: 'movieHot',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params,
  ) => [
    params.limit,
    params.page,
    ...getGlobalFilterDependencies(params.filter),
    ...getRecordDependencies(params.search),
  ],
  request: movieHotRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToHotMovie),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(HotMovieSchema),
  ttl: time.hours(1),
});
