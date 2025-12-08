import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaCreditsSchema } from '$lib/requests/models/MediaCredits.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaCredits } from '../../_internal/mapToMediaCredits.ts';

type PersonMovieCreditsParams = { slug: string } & ApiParams;

const personMovieCreditsRequest = (
  { fetch, slug }: PersonMovieCreditsParams,
) =>
  api({ fetch })
    .people
    .movies({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,images',
      },
    });

export const personMovieCreditsQuery = defineQuery({
  key: 'personMovieCredits',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: personMovieCreditsRequest,
  mapper: (response) => mapToMediaCredits(response.body),
  schema: MediaCreditsSchema,
  ttl: time.days(7),
});
