import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SortBy } from '$lib/sections/lists/user/models/SortBy.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import type { FilterParams } from '../../models/FilterParams.ts';
import { MovieProgressSchema } from '../../models/MovieProgressEntry.ts';
import { UpNextEntrySchema } from '../../models/UpNextEntry.ts';
import { interleaveMediaProgress } from './_internal/interleaveMediaProgress.ts';
import { isValidProgressMovie } from './_internal/isValidProgressMovie.ts';
import {
  mapToMovieProgressEntry,
  movieProgressRequest,
} from './movieProgressQuery.ts';
import { mapUpNextResponse, upNextNitroRequest } from './upNextNitroQuery.ts';

type MediaProgressParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & {
    sortBy?: SortBy;
    sortHow?: SortDirection;
  };

const MediaProgressSchema = z.union([
  UpNextEntrySchema,
  MovieProgressSchema,
]);

export const mediaProgressQuery = defineInfiniteQuery({
  key: 'mediaProgress:v2',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Drop('show'),
    InvalidateAction.Restore,
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.Drop('movie'),
  ],
  dependencies: (
    params: MediaProgressParams,
  ) => [
    params.page,
    params.limit,
    params.sortBy,
    params.sortHow,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: (params) =>
    Promise.all([
      upNextNitroRequest(params),
      movieProgressRequest(params),
    ]),
  mapper: ([upNextResponse, movieProgressResponse], { sortBy, sortHow }) => {
    const episodes = upNextResponse.body.map(mapUpNextResponse);

    const movies = movieProgressResponse.body
      .map(mapToMovieProgressEntry)
      .filter(isValidProgressMovie);

    return {
      // TODO: hmm, dealing with the sorting in interleave is weird :/
      entries: interleaveMediaProgress({ episodes, movies, sortBy, sortHow }),
      page: extractPageMeta(upNextResponse.headers),
    };
  },
  schema: PaginatableSchemaFactory(MediaProgressSchema),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
