import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { MovieProgressResponse } from '@trakt/api';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import type { FilterParams } from '../../models/FilterParams.ts';
import {
  type MovieProgressEntry,
  MovieProgressSchema,
} from '../../models/MovieProgressEntry.ts';
import { isValidProgressMovie } from './_internal/isValidProgressMovie.ts';

type MovieProgressParams =
  & PaginationParams
  & ApiParams
  & FilterParams;

export const mapToMovieProgressEntry = (
  response: MovieProgressResponse,
): MovieProgressEntry => {
  const runtime = response.movie.runtime ?? 0;
  const minutesElapsed = Math.floor((response.progress / 100) * runtime);

  return {
    ...mapToMovieEntry(response.movie),
    playbackId: response.id,
    progress: response.progress,
    minutesElapsed,
    minutesLeft: runtime -
      minutesElapsed,
    lastWatchedAt: response.paused_at ? new Date(response.paused_at) : null,
  };
};

export const movieProgressRequest = (
  { fetch, limit, page, filter }: MovieProgressParams,
) => {
  return api({ fetch })
    .sync
    .progress
    .movies({
      query: {
        page,
        limit,
        extended: 'full,images',
        ...filter,
      },
    });
};

export const movieProgressQuery = defineInfiniteQuery({
  key: 'movieProgress:v2',
  invalidations: [
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.Drop('movie'),
  ],
  dependencies: (
    params: MovieProgressParams,
  ) => [
    params.page,
    params.limit,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: movieProgressRequest,
  mapper: (response) => {
    return {
      entries: response.body
        .map(mapToMovieProgressEntry)
        .filter(isValidProgressMovie),
      page: extractPageMeta(response.headers),
    };
  },
  schema: PaginatableSchemaFactory(MovieProgressSchema),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
