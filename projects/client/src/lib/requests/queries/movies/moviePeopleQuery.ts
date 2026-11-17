import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { fetchPortraitOf } from '$lib/requests/_internal/fetchPortraitOf.ts';
import { mapToMediaCrew } from '$lib/requests/_internal/mapToMediaCrew.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaCrewSchema } from '$lib/requests/models/MediaCrew.ts';
import { time } from '$lib/utils/timing/time.ts';

type MoviePeopleParams = {
  slug: string;
  portraits?: boolean;
} & ApiParams;

const moviePeopleListRequest = ({ fetch, slug }: MoviePeopleParams) =>
  api({ fetch }).movies.people({
    params: {
      id: slug,
    },
    query: {},
  });

const moviePeopleRequest = async (params: MoviePeopleParams) => {
  const [people, portraitOf] = await Promise.all([
    moviePeopleListRequest(params),
    params.portraits
      ? fetchPortraitOf({
          fetch: params.fetch,
          media: 'movie',
          slug: params.slug,
        })
      : null,
  ]);

  return { ...people, portraitOf };
};

export const moviePeopleQuery = defineQuery({
  key: 'moviePeople',
  invalidations: [],
  dependencies: (params) => [params.slug, params.portraits ?? false],
  request: moviePeopleRequest,
  mapper: (response) => mapToMediaCrew(response.body, response.portraitOf),
  schema: MediaCrewSchema,
  ttl: time.hours(12),
});
