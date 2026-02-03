import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToSentiments } from '$lib/requests/_internal/mapToSentiments.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { SentimentsSchema } from '$lib/requests/models/Sentiments.ts';
import { time } from '$lib/utils/timing/time.ts';

type ShowSentimentsParams = { slug: string } & ApiParams;

const showSentimentsRequest = (
  { fetch, slug }: ShowSentimentsParams,
) =>
  api({ fetch })
    .shows
    .sentiments({
      params: {
        id: slug,
      },
    });

export const showSentimentsQuery = defineQuery({
  key: 'showSentiments',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showSentimentsRequest,
  mapper: (response) => mapToSentiments(response.body),
  schema: SentimentsSchema,
  ttl: time.hours(3),
});
