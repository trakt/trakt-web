import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaCreditsSchema } from '$lib/requests/models/MediaCredits.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaCredits } from '../../_internal/mapToMediaCredits.ts';

type PeopleShowCreditsParams = { slug: string } & ApiParams;

const peopleShowCreditsRequest = (
  { fetch, slug }: PeopleShowCreditsParams,
) =>
  api({ fetch })
    .people
    .shows({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,images',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch person show credits');
      }

      return response.body;
    });

export const peopleShowCreditsQuery = defineQuery({
  key: 'peopleShowCredits',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: peopleShowCreditsRequest,
  mapper: mapToMediaCredits,
  schema: MediaCreditsSchema,
  ttl: time.days(7),
});
