import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToStreamingServices } from '../../_internal/mapToStreamingServices.ts';
import { StreamingServiceOptionsSchema } from '../../models/StreamingServiceOptions.ts';

type StreamShowParams = {
  id: string;
  country: string;
} & ApiParams;

const showWatchNowRequest = (
  { fetch, id, country }: StreamShowParams,
) =>
  api({ fetch })
    .shows
    .watchnow({
      params: {
        id,
        country,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch show streaming services');
      }

      return response.body;
    });

export const streamShowQuery = defineQuery({
  key: 'streamShow',
  invalidations: [],
  dependencies: (params) => [params.id, params.country],
  request: showWatchNowRequest,
  mapper: (response, params) =>
    mapToStreamingServices(response, params.country),
  schema: StreamingServiceOptionsSchema,
  ttl: time.days(1),
});
