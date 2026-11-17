import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { getPeopleExtended } from '$lib/requests/_internal/getPeopleExtended.ts';
import { fetchPortraitOf } from '$lib/requests/_internal/fetchPortraitOf.ts';
import { mapToMediaCrew } from '$lib/requests/_internal/mapToMediaCrew.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaCrewSchema } from '$lib/requests/models/MediaCrew.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';

type ShowSeasonPeopleParams = {
  slug: string;
  season: number;
  guestStars?: boolean;
  portraits?: boolean;
} & ApiParams;

const showSeasonPeopleListRequest = ({
  fetch,
  slug,
  season,
  guestStars = false,
}: ShowSeasonPeopleParams) =>
  api({ fetch }).shows.season.people({
    params: {
      id: slug,
      season: castNumberAsString(season),
    },
    query: {
      extended: getPeopleExtended(guestStars) as 'markdown' | undefined,
    },
  });

const showSeasonPeopleRequest = async (params: ShowSeasonPeopleParams) => {
  const [people, portraitOf] = await Promise.all([
    showSeasonPeopleListRequest(params),
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

export const showSeasonPeopleQuery = defineQuery({
  key: 'showSeasonPeople',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
    params.season,
    params.guestStars ?? false,
    params.portraits ?? false,
  ],
  request: showSeasonPeopleRequest,
  mapper: (response) => mapToMediaCrew(response.body, response.portraitOf),
  schema: MediaCrewSchema,
  ttl: time.hours(12),
});
