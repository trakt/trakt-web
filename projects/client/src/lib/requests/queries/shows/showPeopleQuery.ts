import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaCrew } from '$lib/requests/_internal/mapToMediaCrew.ts';
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
    });

export const showPeopleQuery = defineQuery({
  key: 'showPeople',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showPeopleRequest,
  mapper: (response) => mapToMediaCrew(response.body),
  schema: MediaCrewSchema,
  ttl: time.days(7),
});
