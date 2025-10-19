import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { MovieProgressResponse } from '@trakt/api';
import z from 'zod';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

const MovieProgressSchema = MovieEntrySchema.merge(z.object({
  progress: z.number(),
  minutesElapsed: z.number(),
  minutesLeft: z.number(),
}));
export type MovieProgressEntry = z.infer<typeof MovieProgressSchema>;

type MovieProgressParams = PaginationParams & ApiParams;

const mapToInProgressMovie = (response: MovieProgressResponse) => {
  const runtime = response.movie.runtime ?? 0;
  const minutesElapsed = Math.floor((response.progress / 100) * runtime);

  return {
    ...mapToMovieEntry(response.movie),
    progress: response.progress,
    minutesElapsed,
    minutesLeft: runtime -
      minutesElapsed,
  };
};

const movieProgressRequest = (params: MovieProgressParams) => {
  const { fetch, limit, page } = params;

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
  invalidations: [InvalidateAction.MarkAsWatched('movie')],
  dependencies: (
    params: MovieProgressParams,
  ) => [params.page, params.limit],
  request: movieProgressRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToInProgressMovie)
      /**
       * FIXME: remove once the DB accurately tracks progress
       */
      .filter((movie) => movie.minutesElapsed > 5),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MovieProgressSchema),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
