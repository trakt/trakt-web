import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToSentiments } from '$lib/requests/_internal/mapToSentiments.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { SentimentsSchema } from '$lib/requests/models/Sentiments.ts';
import { time } from '$lib/utils/timing/time.ts';

type MovieSentimentsParams = { slug: string } & ApiParams;

const movieSentimentsRequest = (
  { fetch, slug }: MovieSentimentsParams,
) =>
  api({ fetch })
    .movies
    .sentiments({
      params: {
        id: slug,
      },
    });

export const movieSentimentsQuery = defineQuery({
  key: 'movieSentiments',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: movieSentimentsRequest,
  mapper: (response) => mapToSentiments(response.body),
  schema: SentimentsSchema,
  ttl: time.hours(3),
});
