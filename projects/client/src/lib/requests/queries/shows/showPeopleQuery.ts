import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapPeopleResponseToMediaCrew } from '$lib/requests/_internal/mapPeopleResponseToMediaCrew.ts';
import { MediaCrewSchema } from '$lib/requests/models/MediaCrew.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

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
        extended: 'cloud9',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch show people');
      }

      return response.body;
    });

export const showPeopleQuery = await defineQuery({
  key: 'showPeople',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showPeopleRequest,
  mapper: (body) => mapPeopleResponseToMediaCrew(body),
  schema: MediaCrewSchema,
});
