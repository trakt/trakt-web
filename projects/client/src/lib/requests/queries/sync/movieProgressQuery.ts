import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type {
  ListedMovieResponse,
  MovieProgressResponse,
  UpNextIntentRequest,
} from '@trakt/api';
import z from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import type { FilterParams } from '../../models/FilterParams.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';
import { isValidProgressMovie } from './_internal/isValidProgressMovie.ts';

// FIXME: technically not a filter; find out all possible values and move to params in api
const UNRELEASED_FILTER = {
  hide: 'unreleased',
};

export const MovieProgressSchema = MovieEntrySchema.merge(z.object({
  progress: z.number(),
  minutesElapsed: z.number(),
  minutesLeft: z.number(),
  playbackId: z.number(),
  lastWatchedAt: z.date().nullable(),
}));
export type MovieProgressEntry = z.infer<typeof MovieProgressSchema>;

type MovieProgressParams =
  & PaginationParams
  & ApiParams
  & UpNextIntentRequest
  & FilterParams;

const mapToInProgressMovie = (response: MovieProgressResponse) => {
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

const mapToStartWatchingMovie = (response: ListedMovieResponse) => {
  const movie = mapToMovieEntry(response.movie);

  return {
    ...movie,
    playbackId: 0,
    progress: NaN,
    minutesElapsed: 0,
    minutesLeft: movie.runtime ?? 0,
    lastWatchedAt: null,
  };
};

export const mapToMovieProgressEntry = (
  item: MovieProgressResponse | ListedMovieResponse,
): MovieProgressEntry => {
  return 'listed_at' in item
    ? mapToStartWatchingMovie(item)
    : mapToInProgressMovie(item);
};

export type MovieProgressSuccessResponse = {
  status: 200;
  body: MovieProgressResponse[] | ListedMovieResponse[];
  headers: Headers;
};

export type MovieProgressResponseType = MovieProgressSuccessResponse | {
  status: number;
  body: unknown;
  headers: Headers;
};

export const movieProgressRequest = (
  { fetch, limit, page, intent, filter }: MovieProgressParams,
): Promise<MovieProgressResponseType> => {
  // FIXME: switch to actual movie progress endpoints once available
  if (intent === 'start') {
    return api({ fetch })
      .users
      .watchlist
      .movies({
        params: {
          id: 'me',
          sort: 'released',
        },
        query: {
          ...UNRELEASED_FILTER,
          extended: 'full,images,colors',
          page,
          limit,
          ...filter,
        },
      });
  }

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

export const movieProgressQuery = defineQuery({
  key: 'movieProgress',
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
    params.intent,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: movieProgressRequest,
  mapper: (queryResponse) => {
    const response = queryResponse as MovieProgressSuccessResponse;

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
