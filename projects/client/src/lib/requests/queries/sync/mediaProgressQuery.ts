import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import type { FilterParams } from '../../models/FilterParams.ts';
import { interleaveMediaProgress } from './_internal/interleaveMediaProgress.ts';
import { isValidProgressMovie } from './_internal/isValidProgressMovie.ts';
import {
  mapToMovieProgressEntry,
  movieProgressRequest,
  MovieProgressSchema,
  type MovieProgressSuccessResponse,
} from './movieProgressQuery.ts';
import {
  mapUpNextResponse,
  UpNextEntryNitroSchema,
  upNextNitroRequest,
} from './upNextNitroQuery.ts';

export type MediaProgressIntent = 'continue' | 'start';

type MediaProgressParams = PaginationParams & ApiParams & FilterParams & {
  intent: MediaProgressIntent;
};

const MediaProgressSchema = z.union([
  UpNextEntryNitroSchema,
  MovieProgressSchema,
]);

export const mediaProgressQuery = defineQuery({
  key: 'mediaProgress',
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
    params.intent,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: (params) =>
    Promise.all([
      upNextNitroRequest(params),
      movieProgressRequest(params),
    ]),
  mapper: ([upNextResponse, movieProgressResponse], params) => {
    const episodes = upNextResponse.body.map(mapUpNextResponse);

    const movieResponse = movieProgressResponse as MovieProgressSuccessResponse;
    const movies = movieResponse.body
      .map(mapToMovieProgressEntry)
      .filter(isValidProgressMovie);

    return {
      entries: interleaveMediaProgress({
        intent: params.intent,
        episodes,
        movies,
      }),
      page: extractPageMeta(upNextResponse.headers),
    };
  },
  schema: PaginatableSchemaFactory(MediaProgressSchema),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
