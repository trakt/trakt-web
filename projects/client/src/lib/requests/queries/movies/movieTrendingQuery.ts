import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { MovieWatchedResponse } from '@trakt/api';
import { z } from 'zod';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

export const TrendingMovieSchema = MovieEntrySchema.extend({
  watchers: z.number(),
});
export type TrendingMovie = z.infer<typeof TrendingMovieSchema>;

type MovieTrendingParams = PaginationParams & ApiParams;

function mapToTrendingMovie({
  watcher_count: watchers,
  movie,
}: MovieWatchedResponse): TrendingMovie {
  return {
    watchers,
    ...mapToMovieEntry(movie),
  };
}

const movieTrendingRequest = (
  { fetch, limit, page }: MovieTrendingParams,
) =>
  // FIXME: switch back to trending query when stats are fixed
  api({ fetch })
    .movies
    .watched({
      params: {
        period: 'daily',
      },
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
        throw new Error('Failed to fetch trending movies');
      }

      return response;
    });

export const movieTrendingQuery = defineQuery({
  key: 'movieTrending',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (params) => [params.limit, params.page],
  request: movieTrendingRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToTrendingMovie),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(TrendingMovieSchema),
  ttl: time.hours(1),
});
