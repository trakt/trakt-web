import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { time } from '$lib/utils/timing/time';

type MovieSummaryParams = { slug: string } & ApiParams;

const movieSummaryRequest = (
  { fetch, slug }: MovieSummaryParams,
) =>
  api({ fetch })
    .movies
    .summary({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,cloud9',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch movie summary');
      }

      return response.body;
    });

export const movieSummaryQuery = defineQuery({
  key: 'movieSummary',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: movieSummaryRequest,
  mapper: mapMovieResponseToMovieSummary,
  schema: MediaEntrySchema,
  ttl: time.days(1),
});
