import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapMovieResponseToMovieSummary } from '../../_internal/mapMovieResponseToMovieSummary.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

type MoviePopularParams = {
  page?: number;
  limit?: number;
} & ApiParams;

const moviePopularRequest = (
  { fetch, limit = DEFAULT_PAGE_SIZE, page = 1 }: MoviePopularParams,
) =>
  api({ fetch })
    .movies
    .popular({
      query: {
        extended: 'full,cloud9',
        page,
        limit,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch popular movies');
      }

      return response;
    });

export const moviePopularQuery = await defineQuery({
  key: 'moviePopular',
  invalidations: [],
  dependencies: (params) => [params.limit, params.page],
  request: moviePopularRequest,
  mapper: (response) => ({
    entries: response.body.map(mapMovieResponseToMovieSummary),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MovieEntrySchema),
});
