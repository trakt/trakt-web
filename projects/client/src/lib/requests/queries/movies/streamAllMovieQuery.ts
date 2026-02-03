import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToCountryStreamingServices } from '../../_internal/mapToCountryStreamingServices.ts';
import { CountryStreamingServiceOptionsSchema } from '../../models/CountryStreamingServiceOptions.ts';

type StreamAllMovieParams = {
  slug: string;
} & ApiParams;

const streamAllMovieRequest = (
  { fetch, slug }: StreamAllMovieParams,
) =>
  api({ fetch })
    .movies
    .watchnow({
      params: {
        id: slug,
      },
    });

export const streamAllMovieQuery = defineQuery({
  key: 'streamAllMovie',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: streamAllMovieRequest,
  mapper: (response) => mapToCountryStreamingServices(response.body),
  schema: CountryStreamingServiceOptionsSchema.array(),
  ttl: time.hours(3),
});
