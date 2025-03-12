import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { MovieActivityHistoryResponse } from '@trakt/api';
import { z } from 'zod';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

type MovieActivityHistoryParams = {
  limit: number;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  id?: number;
} & ApiParams;

export const MovieActivityHistorySchema = z.object({
  id: z.number(),
  watchedAt: z.date(),
  movie: MovieEntrySchema,
  type: z.literal('movie'),
});
export type MovieActivityHistory = z.infer<typeof MovieActivityHistorySchema>;

const movieActivityHistoryRequest = (
  { fetch, startDate, endDate, limit, id, page = 1 }:
    MovieActivityHistoryParams,
) => {
  const queryParams = {
    extended: 'full,images' as const,
    start_at: startDate?.toISOString(),
    end_at: endDate?.toISOString(),
    limit,
    page,
  };

  const request = id
    ? api({ fetch }).users.history.movie({
      params: { id: 'me', item_id: `${id}` },
      query: queryParams,
    })
    : api({ fetch }).users.history.movies({
      params: { id: 'me' },
      query: queryParams,
    });

  return request.then((response) => {
    if (response.status !== 200) {
      throw new Error('Failed to fetch movies history');
    }

    return response;
  });
};

export const mapToMovieActivityHistory = (
  historyMovie: MovieActivityHistoryResponse,
) => ({
  id: historyMovie.id,
  watchedAt: new Date(historyMovie.watched_at),
  movie: mapToMovieEntry(historyMovie.movie),
  type: 'movie' as const,
});

export const movieActivityHistoryQuery = defineQuery({
  key: 'movieActivityHistory',
  invalidations: [InvalidateAction.MarkAsWatched('movie')],
  dependencies: (params: MovieActivityHistoryParams) => [
    params.startDate,
    params.endDate,
    params.limit,
    params.page,
    params.id,
  ],
  request: movieActivityHistoryRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToMovieActivityHistory),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MovieActivityHistorySchema),
  ttl: time.hours(6),
});
