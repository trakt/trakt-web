import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToStreamingServices } from '../../_internal/mapToStreamingServices.ts';
import { StreamingServiceOptionsSchema } from '../../models/StreamingServiceOptions.ts';

type StreamEpisodeParams = {
  slug: string;
  season: number;
  episode: number;
  country: string;
} & ApiParams;

const streamEpisodeRequest = (
  { fetch, slug, season, episode, country }: StreamEpisodeParams,
) =>
  api({ fetch })
    .shows
    .episode
    .watchnow({
      params: {
        id: slug,
        season,
        episode,
        country,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch episode streaming services');
      }

      return response.body;
    });

export const streamEpisodeQuery = defineQuery({
  key: 'streamEpisode',
  invalidations: [],
  dependencies: (
    params,
  ) => [params.slug, params.season, params.episode, params.country],
  request: streamEpisodeRequest,
  mapper: (response, params) =>
    mapToStreamingServices(response, params.country),
  schema: StreamingServiceOptionsSchema,
  ttl: time.days(1),
});
