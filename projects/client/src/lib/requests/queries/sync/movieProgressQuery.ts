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
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

const MovieProgressSchema = MovieEntrySchema.merge(z.object({
  progress: z.number(),
  minutesElapsed: z.number(),
  minutesLeft: z.number(),
  playbackId: z.number(),
}));
export type MovieProgressEntry = z.infer<typeof MovieProgressSchema>;

type MovieProgressParams = PaginationParams & ApiParams & UpNextIntentRequest;

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
  };
};

const mapToStartWatchingMovie = (response: ListedMovieResponse) => {
  const movie = mapToMovieEntry(response.movie);

  return {
    ...movie,
    playbackId: 0,
    progress: 0,
    minutesElapsed: 0,
    minutesLeft: movie.runtime ?? 0,
  };
};

type SuccessResponse = {
  status: 200;
  body: MovieProgressResponse[] | ListedMovieResponse[];
  headers: Headers;
};

type ResponseType = SuccessResponse | {
  status: number;
  body: unknown;
  headers: Headers;
};

const movieProgressRequest = (
  { fetch, limit, page, intent }: MovieProgressParams,
): Promise<ResponseType> => {
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
          extended: 'full,images,colors',
          page,
          limit,
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
  ) => [params.page, params.limit, params.intent],
  request: movieProgressRequest,
  mapper: (queryResponse) => {
    const response = queryResponse as SuccessResponse;

    return {
      entries: response.body.map((item) => {
        return 'listed_at' in item
          ? mapToStartWatchingMovie(item)
          : mapToInProgressMovie(item);
      }),
      page: extractPageMeta(response.headers),
    };
  },
  schema: PaginatableSchemaFactory(MovieProgressSchema),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
