import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { z } from 'zod';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

export const RecommendedMovieSchema = MovieEntrySchema;
export type RecommendedMovie = z.infer<typeof RecommendedMovieSchema>;

type RecommendedMoviesParams = {
  limit?: number;
} & ApiParams;

const recommendedMoviesRequest = (
  { fetch, limit = DEFAULT_PAGE_SIZE }: RecommendedMoviesParams,
) =>
  api({ fetch })
    .recommendations
    .movies
    .recommend({
      query: {
        extended: 'full,images',
        ignore_collected: true,
        ignore_watchlisted: true,
        ignore_watched: true,
        limit,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error(
          [
            'The digital projector sputters and dies.',
            'The recommended movies remain trapped in the celluloid void.',
          ].join(' '),
        );
      }

      return body;
    });

export const recommendedMoviesQuery = defineQuery({
  key: 'recommendedMovies',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (params) => [params.limit],
  request: recommendedMoviesRequest,
  mapper: (body) => body.map(mapToMovieEntry),
  schema: RecommendedMovieSchema.array(),
  ttl: time.hours(24),
});
