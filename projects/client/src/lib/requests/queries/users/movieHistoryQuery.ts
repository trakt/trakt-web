import type { HistoryMoviesResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

type MovieHistoryParams = {
  startDate: Date;
  endDate: Date;
  limit: number;
  page?: number;
} & ApiParams;

const HistoryMovieSchema = z.object({
  id: z.number(),
  watchedAt: z.date(),
  movie: MovieEntrySchema,
  type: z.literal('movie'),
});
export type HistoryMovie = z.infer<typeof HistoryMovieSchema>;

const movieHistoryRequest = (
  { fetch, startDate, endDate, limit, page = 1 }: MovieHistoryParams,
) =>
  api({ fetch })
    .users
    .history
    .movies({
      params: {
        id: 'me',
      },
      query: {
        extended: 'full,images',
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        limit,
        page,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch movies history');
      }

      return response;
    });

const mapResponseToHistory = (
  historyMovie: HistoryMoviesResponse,
) => ({
  id: historyMovie.id,
  watchedAt: new Date(historyMovie.watched_at),
  movie: mapMovieResponseToMovieSummary(historyMovie.movie),
  type: 'movie' as const,
});

export const movieHistoryQuery = defineQuery({
  key: 'movieHistory',
  invalidations: [InvalidateAction.MarkAsWatched('movie')],
  dependencies: (params: MovieHistoryParams) => [
    params.startDate,
    params.endDate,
    params.limit,
    params.page,
  ],
  request: movieHistoryRequest,
  mapper: (response) => ({
    entries: response.body.map(mapResponseToHistory),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(HistoryMovieSchema),
  ttl: time.hours(6),
});
