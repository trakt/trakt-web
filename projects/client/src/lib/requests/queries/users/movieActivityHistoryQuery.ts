import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { MovieActivityHistoryResponse } from '@trakt/api';
import { z } from 'zod';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

type MovieActivityHistoryParams =
  & {
    slug: string;
    startDate?: Date;
    endDate?: Date;
    id?: number;
  }
  & ApiParams;

export const MovieActivityHistorySchema = z.object({
  id: z.number(),
  key: z.string(),
  watchedAt: z.date(),
  movie: MovieEntrySchema,
  type: z.literal('movie'),
});
export type MovieActivityHistory = z.infer<typeof MovieActivityHistorySchema>;

export const movieActivityHistoryRequest = (
  { fetch, slug, startDate, endDate, id }: MovieActivityHistoryParams,
) => {
  const queryParams = {
    extended: 'full,images' as const,
    start_at: startDate?.toISOString(),
    end_at: endDate?.toISOString(),
    limit: 'all' as unknown as number,
  };

  return id
    ? api({ fetch }).users.history.movie({
      params: { id: slug, item_id: `${id}` },
      query: queryParams,
    })
    : api({ fetch }).users.history.movies({
      params: { id: slug },
      query: queryParams,
    });
};

export const mapToMovieActivityHistory = (
  historyMovie: MovieActivityHistoryResponse,
) => ({
  id: historyMovie.id,
  key: `movie-${historyMovie.id}`,
  watchedAt: new Date(historyMovie.watched_at),
  movie: mapToMovieEntry(historyMovie.movie),
  type: 'movie' as const,
});

export const movieActivityHistoryQuery = defineInfiniteQuery({
  key: 'movieActivityHistory',
  invalidations: [InvalidateAction.MarkAsWatched('movie')],
  dependencies: (params: MovieActivityHistoryParams) => [
    params.startDate,
    params.endDate,
    params.id,
    params.slug,
  ],
  request: movieActivityHistoryRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToMovieActivityHistory),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MovieActivityHistorySchema),
  ttl: time.hours(6),
});
