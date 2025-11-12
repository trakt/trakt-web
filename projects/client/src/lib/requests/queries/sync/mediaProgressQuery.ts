import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { type UpNextIntentRequest } from '@trakt/api';
import z from 'zod';
import { weave } from '../../../utils/array/weave.ts';
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

type MediaProgressParams = PaginationParams & ApiParams & UpNextIntentRequest;

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
  ) => [params.page, params.limit, params.intent],
  request: (params) =>
    Promise.all([
      upNextNitroRequest(params),
      movieProgressRequest(params),
    ]),
  mapper: ([upNextResponse, movieProgressResponse]) => {
    const episodes = upNextResponse.body.map(mapUpNextResponse);

    const movieResponse = movieProgressResponse as MovieProgressSuccessResponse;
    const movies = movieResponse.body
      .map(mapToMovieProgressEntry)
      .filter(isValidProgressMovie);

    return {
      entries: weave(episodes, movies).toSorted((a, b) => {
        const dateA = a.lastWatchedAt ? a.lastWatchedAt.getTime() : 0;
        const dateB = b.lastWatchedAt ? b.lastWatchedAt.getTime() : 0;
        return dateB - dateA;
      }),
      page: extractPageMeta(upNextResponse.headers),
    };
  },
  schema: PaginatableSchemaFactory(MediaProgressSchema),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
