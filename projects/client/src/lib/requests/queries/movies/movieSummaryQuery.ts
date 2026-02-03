import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { time } from '$lib/utils/timing/time.ts';

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
        extended: 'full,images,colors,streaming_ids',
      },
    });

export const movieSummaryQuery = defineQuery({
  key: 'movieSummary',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: movieSummaryRequest,
  mapper: (response) => mapToMovieEntry(response.body),
  schema: MediaEntrySchema,
  ttl: time.hours(3),
});
