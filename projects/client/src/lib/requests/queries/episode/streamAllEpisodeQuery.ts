import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToCountryStreamingServices } from '../../_internal/mapToCountryStreamingServices.ts';
import { CountryStreamingServiceOptionsSchema } from '../../models/CountryStreamingServiceOptions.ts';

type StreamAllEpisodeParams = {
  slug: string;
  season: number;
  episode: number;
} & ApiParams;

const streamAllEpisodeRequest = (
  { fetch, slug, season, episode }: StreamAllEpisodeParams,
) =>
  api({ fetch })
    .shows
    .episode
    .watchnow({
      params: {
        id: slug,
        season: castNumberAsString(season),
        episode,
      },
    });

export const streamAllEpisodeQuery = defineQuery({
  key: 'streamAllEpisode',
  invalidations: [],
  dependencies: (
    params,
  ) => [params.slug, params.season, params.episode],
  request: streamAllEpisodeRequest,
  mapper: (response) => mapToCountryStreamingServices(response.body),
  schema: CountryStreamingServiceOptionsSchema.array(),
  ttl: time.days(1),
});
