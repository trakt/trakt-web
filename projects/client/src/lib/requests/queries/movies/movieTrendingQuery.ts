import type { MovieTrendingResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { z } from 'zod';
import { mapMovieResponseToMovieSummary } from '../../_internal/mapMovieResponseToMovieSummary.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

export const TrendingMovieSchema = MovieEntrySchema.extend({
  watchers: z.number(),
});
export type TrendingMovie = z.infer<typeof TrendingMovieSchema>;

type MovieTrendingParams = {
  page?: number;
  limit?: number;
} & ApiParams;

function mapResponseToTrendingMovie({
  watchers,
  movie,
}: MovieTrendingResponse): TrendingMovie {
  return {
    watchers,
    ...mapMovieResponseToMovieSummary(movie),
  };
}

const movieTrendingRequest = (
  { fetch, limit = DEFAULT_PAGE_SIZE, page = 1 }: MovieTrendingParams,
) =>
  api({ fetch })
    .movies
    .trending({
      query: {
        extended: 'full,cloud9',
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
  invalidations: [],
  dependencies: (params) => [params.limit, params.page],
  request: movieTrendingRequest,
  mapper: (response) => ({
    entries: response.body.map(mapResponseToTrendingMovie),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(TrendingMovieSchema),
});
