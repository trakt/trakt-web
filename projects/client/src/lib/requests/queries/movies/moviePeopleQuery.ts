import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapPeopleResponseToMediaCrew } from '$lib/requests/_internal/mapPeopleResponseToMediaCrew.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaCrewSchema } from '$lib/requests/models/MediaCrew.ts';

type MoviePeopleParams = {
  slug: string;
} & ApiParams;

const moviePeopleRequest = (
  { fetch, slug }: MoviePeopleParams,
) =>
  api({ fetch })
    .movies
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
        throw new Error('Failed to fetch movie people');
      }

      return response.body;
    });

export const moviePeopleQuery = defineQuery({
  key: 'moviePeople',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: moviePeopleRequest,
  mapper: (body) => mapPeopleResponseToMediaCrew(body),
  schema: MediaCrewSchema,
});
