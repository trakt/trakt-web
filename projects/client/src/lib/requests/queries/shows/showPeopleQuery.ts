import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaCrew } from '$lib/requests/_internal/mapToMediaCrew.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaCrewSchema } from '$lib/requests/models/MediaCrew.ts';
import { time } from '$lib/utils/timing/time.ts';

type ShowPeopleParams = {
  slug: string;
  guestStars?: boolean;
} & ApiParams;

const showPeopleRequest = (
  { fetch, slug, guestStars = false }: ShowPeopleParams,
) =>
  api({ fetch })
    .shows
    .people({
      params: {
        id: slug,
      },
      query: {
        extended: (guestStars ? 'images,guest_stars' : 'images') as 'images',
      },
    });

export const showPeopleQuery = defineQuery({
  key: 'showPeople',
  invalidations: [],
  dependencies: (params) => [params.slug, params.guestStars ?? false],
  request: showPeopleRequest,
  mapper: (response) => mapToMediaCrew(response.body),
  schema: MediaCrewSchema,
  ttl: time.hours(12),
});
