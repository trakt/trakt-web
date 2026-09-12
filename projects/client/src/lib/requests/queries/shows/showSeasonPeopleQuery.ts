import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { getPeopleExtended } from '$lib/requests/_internal/getPeopleExtended.ts';
import { mapToMediaCrew } from '$lib/requests/_internal/mapToMediaCrew.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaCrewSchema } from '$lib/requests/models/MediaCrew.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';

type ShowSeasonPeopleParams = {
  slug: string;
  season: number;
  guestStars?: boolean;
} & ApiParams;

const showSeasonPeopleRequest = (
  { fetch, slug, season, guestStars = false }: ShowSeasonPeopleParams,
) =>
  api({ fetch })
    .shows
    .season
    .people({
      params: {
        id: slug,
        season: castNumberAsString(season),
      },
      query: {
        extended: getPeopleExtended(guestStars),
      },
    });

export const showSeasonPeopleQuery = defineQuery({
  key: 'showSeasonPeople',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
    params.season,
    params.guestStars ?? false,
  ],
  request: showSeasonPeopleRequest,
  mapper: (response) => mapToMediaCrew(response.body),
  schema: MediaCrewSchema,
  ttl: time.hours(12),
});
