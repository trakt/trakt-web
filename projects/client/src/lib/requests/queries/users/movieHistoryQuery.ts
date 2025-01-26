import type { HistoryMoviesResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time';
import { z } from 'zod';
import { MovieEntrySchema } from '../../models/MovieEntry';

type MovieHistoryParams = {
  startDate: Date;
  endDate: Date;
  limit: number;
} & ApiParams;

const HistoryMovieSchema = z.object({
  id: z.number(),
  watchedAt: z.date(),
  movie: MovieEntrySchema,
});
export type HistoryMovie = z.infer<typeof HistoryMovieSchema>;

const movieHistoryRequest = (
  { fetch, startDate, endDate, limit }: MovieHistoryParams,
) =>
  api({ fetch })
    .users
    .history
    .movies({
      params: {
        id: 'me',
      },
      query: {
        extended: 'full,cloud9',
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        limit,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch movies history');
      }

      return body;
    });

const mapResponseToHistory = (
  historyMovie: HistoryMoviesResponse,
) => ({
  id: historyMovie.id,
  watchedAt: new Date(historyMovie.watched_at),
  movie: mapMovieResponseToMovieSummary(historyMovie.movie),
});

export const movieHistoryQuery = defineQuery({
  key: 'movieHistory',
  invalidations: [InvalidateAction.MarkAsWatched('movie')],
  dependencies: (params: MovieHistoryParams) => [
    params.startDate,
    params.endDate,
    params.limit,
  ],
  request: movieHistoryRequest,
  mapper: (body) => body.map(mapResponseToHistory),
  schema: HistoryMovieSchema.array(),
  ttl: time.hours(6),
});
