import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToStreamingServices } from '../../_internal/mapToStreamingServices.ts';
import { StreamingServiceOptionsSchema } from '../../models/StreamingServiceOptions.ts';

type StreamShowParams = {
  slug: string;
  country: string;
} & ApiParams;

const showWatchNowRequest = (
  { fetch, slug, country }: StreamShowParams,
) =>
  api({ fetch })
    .shows
    .watchnow({
      params: {
        id: slug,
        country,
      },
      query: {
        extended: 'streaming_ranks',
      },
    });

export const streamShowQuery = defineQuery({
  key: 'streamShow',
  invalidations: [],
  dependencies: (params) => [params.slug, params.country],
  request: showWatchNowRequest,
  mapper: (response, params) =>
    mapToStreamingServices(response.body, params.country),
  schema: StreamingServiceOptionsSchema,
  ttl: time.days(1),
});
