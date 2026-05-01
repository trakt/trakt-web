import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { z } from 'zod';
import { api, type ApiParams } from '../../../requests/api.ts';
import { time } from '../../../utils/timing/time.ts';
import { WatchedMediaSchema } from './_internal/WatchedHistorySchema.ts';
import { getLastWatchedAt } from './_internal/getLastWatchedAt.ts';

export const WatchMovieSchema = WatchedMediaSchema.extend({
  watchedDates: z.array(z.date()),
});
export type WatchedMovie = z.infer<typeof WatchMovieSchema>;

export function mapWatchedMovieResponse(
  [id, timestamps]: [string, string[]],
): WatchedMovie {
  return {
    id: Number(id),
    watchedAt: getLastWatchedAt(timestamps),
    plays: timestamps.length,
    watchedDates: timestamps.map((t) => new Date(t)),
  };
}

type CurrentUserWatchedMoviesParams = PaginationParams & ApiParams;

const currentUserWatchedMoviesRequest = (
  { fetch, page = 1, limit }: CurrentUserWatchedMoviesParams,
) => {
  const pagination = {
    page,
    limit,
  };

  return api({ fetch })
    .users
    .watched
    .minimal
    .movies({
      params: { id: 'me' },
      query: {
        extended: 'min',
        ...pagination,
      },
    });
};

export const currentUserWatchedMoviesQuery = defineInfiniteQuery({
  key: 'currentUserWatchedMovies',
  invalidations: [
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (params) => [params.limit],
  request: currentUserWatchedMoviesRequest,
  mapper: (response, { page = 1 }) => ({
    entries: Object.entries(response.body).map(mapWatchedMovieResponse),
    page: extractPageMeta(response.headers, page),
  }),
  schema: PaginatableSchemaFactory(WatchMovieSchema),
  ttl: time.hours(12),
});
