import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { getRecordDependencies } from '$lib/requests/_internal/getRecordDependencies.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';
import {
  AnticipatedMovieSchema,
  mapToAnticipatedMovie,
} from '../movies/movieAnticipatedQuery.ts';
import {
  AnticipatedShowSchema,
  mapToAnticipatedShow,
} from '../shows/showAnticipatedQuery.ts';

type MediaAnticipatedParams = PaginationParams &
  ApiParams &
  FilterParams &
  SearchParams;

const AnticipatedMediaSchema = z.union([
  AnticipatedMovieSchema,
  AnticipatedShowSchema,
]);

const mediaAnticipatedRequest = ({
  fetch,
  limit,
  page,
  filter,
  theme,
  search,
}: MediaAnticipatedParams) => {
  return api({ fetch }).media.anticipated({
    query: {
      extended: 'full,images,colors',
      page,
      limit,
      theme,
      ...filter,
      ...search,
    },
  });
};

export const mediaAnticipatedQuery = defineInfiniteQuery({
  key: 'mediaAnticipated',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (params: MediaAnticipatedParams) => [
    params.limit,
    params.page,
    ...getGlobalFilterDependencies(params.filter),
    params.theme,
    ...getRecordDependencies(params.search),
  ],
  request: mediaAnticipatedRequest,
  mapper: (response) => ({
    entries: response.body.flatMap(({ show, movie, ...rest }) =>
      show
        ? [mapToAnticipatedShow({ ...rest, show })]
        : movie
          ? [mapToAnticipatedMovie({ ...rest, movie })]
          : [],
    ),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(AnticipatedMediaSchema),
  ttl: time.hours(3),
});
