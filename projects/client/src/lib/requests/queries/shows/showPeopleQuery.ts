import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapPeopleResponseToMediaCrew } from '$lib/requests/_internal/mapPeopleResponseToMediaCrew.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaCrewSchema } from '$lib/requests/models/MediaCrew.ts';
import { time } from '$lib/utils/timing/time.ts';

type ShowPeopleParams = {
  slug: string;
} & ApiParams;

const showPeopleRequest = (
  { fetch, slug }: ShowPeopleParams,
) =>
  api({ fetch })
    .shows
    .people({
      params: {
        id: slug,
      },
      query: {
        extended: 'images',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch show people');
      }

      return response.body;
    });

export const showPeopleQuery = defineQuery({
  key: 'showPeople',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showPeopleRequest,
  mapper: (body) => mapPeopleResponseToMediaCrew(body),
  schema: MediaCrewSchema,
  ttl: time.days(30),
});
