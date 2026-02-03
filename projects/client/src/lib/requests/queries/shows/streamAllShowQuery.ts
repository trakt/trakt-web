import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToCountryStreamingServices } from '../../_internal/mapToCountryStreamingServices.ts';
import { CountryStreamingServiceOptionsSchema } from '../../models/CountryStreamingServiceOptions.ts';

type StreamAllShowParams = {
  slug: string;
} & ApiParams;

const showAllWatchNowRequest = (
  { fetch, slug }: StreamAllShowParams,
) =>
  api({ fetch })
    .shows
    .watchnow({
      params: {
        id: slug,
      },
    });

export const streamAllShowQuery = defineQuery({
  key: 'streamAllShow',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showAllWatchNowRequest,
  mapper: (response) => mapToCountryStreamingServices(response.body),
  schema: CountryStreamingServiceOptionsSchema.array(),
  ttl: time.hours(3),
});
