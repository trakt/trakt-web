import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';

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

      return response.body.cast ?? [];
    });

export const peopleShowCreditsQuery = defineQuery({
  key: 'peopleShowCredits',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: peopleShowCreditsRequest,
  mapper: (response) => response.map(({ show }) => mapToShowEntry(show)),
  schema: ShowEntrySchema.array(),
  ttl: time.days(7),
});
