import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { getPeopleExtended } from '$lib/requests/_internal/getPeopleExtended.ts';
import { fetchPortraitOf } from '$lib/requests/_internal/fetchPortraitOf.ts';
import { mapToMediaCrew } from '$lib/requests/_internal/mapToMediaCrew.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaCrewSchema } from '$lib/requests/models/MediaCrew.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';

type EpisodePeopleParams = {
  slug: string;
  season: number;
  guestStars?: boolean;
  episode: number;
  portraits?: boolean;
} & ApiParams;

const episodePeopleListRequest = ({
  fetch,
  slug,
  season,
  episode,
  guestStars = false,
}: EpisodePeopleParams) =>
  api({ fetch }).shows.episode.people({
    params: {
      id: slug,
      season: castNumberAsString(season),
      episode,
    },
    query: {
      extended: getPeopleExtended(guestStars),
    },
  });

const episodePeopleRequest = async (params: EpisodePeopleParams) => {
  const [people, portraitOf] = await Promise.all([
    episodePeopleListRequest(params),
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

export const episodePeopleQuery = defineQuery({
  key: 'episodePeopleQuery',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
    params.season,
    params.episode,
    params.guestStars ?? false,
    params.portraits ?? false,
  ],
  request: episodePeopleRequest,
  mapper: (response) => mapToMediaCrew(response.body, response.portraitOf),
  schema: MediaCrewSchema,
  ttl: time.hours(12),
});
