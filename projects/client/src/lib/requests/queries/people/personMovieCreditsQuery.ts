import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { MediaCreditsSchema } from '$lib/requests/models/MediaCredits.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaCredits } from '../../_internal/mapToMediaCredits.ts';

type PersonMovieCreditsParams = { slug: string } & ApiParams & FilterParams;

const personMovieCreditsRequest = (
  { fetch, slug, filter }: PersonMovieCreditsParams,
) =>
  api({ fetch })
    .people
    .movies({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,images',
        ...filter,
      },
    });

export const personMovieCreditsQuery = defineQuery({
  key: 'personMovieCredits:v2',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: personMovieCreditsRequest,
  mapper: (response) => mapToMediaCredits(response.body),
  schema: MediaCreditsSchema,
  ttl: time.hours(12),
});
