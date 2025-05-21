import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeStatsSchema } from '$lib/requests/models/EpisodeStats.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToEpisodeStats } from '../../_internal/mapToEpisodeStats.ts';

type EpisodeStatsParams = {
  slug: string;
  season: number;
  episode: number;
} & ApiParams;

const episodeStatsRequest = (
  { fetch, slug, season, episode }: EpisodeStatsParams,
) =>
  api({ fetch })
    .shows
    .episode
    .stats({
      params: {
        id: slug,
        season: castNumberAsString(season),
        episode,
      },
    });

export const episodeStatsQuery = defineQuery({
  key: 'episodeStats',
  invalidations: [],
  dependencies: (params) => [params.slug, params.season, params.episode],
  request: episodeStatsRequest,
  mapper: (response) => mapToEpisodeStats(response.body),
  schema: EpisodeStatsSchema,
  ttl: time.minutes(30),
});
