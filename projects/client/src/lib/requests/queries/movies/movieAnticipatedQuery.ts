import type { MovieAnticipatedResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

export const AnticipatedMovieSchema = MovieEntrySchema.extend({
  score: z.number(),
});
export type AnticipatedMovie = z.infer<typeof AnticipatedMovieSchema>;

type MovieAnticipatedParams = PaginationParams & ApiParams;

function mapToAnticipatedMovie({
  list_count,
  movie,
}: MovieAnticipatedResponse): AnticipatedMovie {
  return {
    score: list_count,
    ...mapToMovieEntry(movie),
  };
}

const movieAnticipatedRequest = (
  { fetch, limit, page }: MovieAnticipatedParams,
) =>
  api({ fetch })
    .movies
    .anticipated({
      query: {
        extended: 'full,images',
        ignore_collected: true,
        ignore_watchlisted: true,
        ignore_watched: true,
        page,
        limit,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch anticipated movies');
      }

      return response;
    });

export const movieAnticipatedQuery = defineQuery({
  key: 'movieAnticipated',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (params) => [params.limit, params.page],
  request: movieAnticipatedRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToAnticipatedMovie),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(AnticipatedMovieSchema),
  ttl: time.days(1),
});
