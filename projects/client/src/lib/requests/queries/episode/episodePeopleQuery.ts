import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaCrew } from '$lib/requests/_internal/mapToMediaCrew.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaCrewSchema } from '$lib/requests/models/MediaCrew.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';

type EpisodePeopleParams =
  & { slug: string; season: number; episode: number }
  & ApiParams;

const episodePeopleRequest = (
  { fetch, slug, season, episode }: EpisodePeopleParams,
) =>
  api({ fetch })
    .shows
    .episode
    .people({
      params: {
        id: slug,
        season: castNumberAsString(season),
        episode,
      },
      query: {
        extended: 'images',
      },
    });

export const episodePeopleQuery = defineQuery({
  key: 'episodePeopleQuery',
  invalidations: [],
  dependencies: (params) => [params.slug, params.season, params.episode],
  request: episodePeopleRequest,
  mapper: (response) => mapToMediaCrew(response.body),
  schema: MediaCrewSchema,
  ttl: time.days(7),
});
