import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { getPeopleExtended } from '$lib/requests/_internal/getPeopleExtended.ts';
import { fetchPortraitOf } from '$lib/requests/_internal/fetchPortraitOf.ts';
import { mapToMediaCrew } from '$lib/requests/_internal/mapToMediaCrew.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaCrewSchema } from '$lib/requests/models/MediaCrew.ts';
import { time } from '$lib/utils/timing/time.ts';

type ShowPeopleParams = {
  slug: string;
  guestStars?: boolean;
  portraits?: boolean;
} & ApiParams;

const showPeopleListRequest = ({
  fetch,
  slug,
  guestStars = false,
}: ShowPeopleParams) =>
  api({ fetch }).shows.people({
    params: {
      id: slug,
    },
    query: {
      extended: getPeopleExtended(guestStars),
    },
  });

const showPeopleRequest = async (params: ShowPeopleParams) => {
  const [people, portraitOf] = await Promise.all([
    showPeopleListRequest(params),
    params.portraits
      ? fetchPortraitOf({
          fetch: params.fetch,
          media: 'show',
          slug: params.slug,
        })
      : null,
  ]);

  return { ...people, portraitOf };
};

export const showPeopleQuery = defineQuery({
  key: 'showPeople',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
    params.guestStars ?? false,
    params.portraits ?? false,
  ],
  request: showPeopleRequest,
  mapper: (response) => mapToMediaCrew(response.body, response.portraitOf),
  schema: MediaCrewSchema,
  ttl: time.hours(12),
});
