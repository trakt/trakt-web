import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapStatsResponseToEpisodeStats } from '$lib/requests/_internal/mapStatsResponseToEpisodeStats';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeStatsSchema } from '$lib/requests/models/EpisodeStats';
import { time } from '$lib/utils/timing/time';

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
        season,
        episode,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch episode stats');
      }

      return response.body;
    });

export const episodeStatsQuery = defineQuery({
  key: 'episodeStats',
  invalidations: [],
  dependencies: (params) => [params.slug, params.season, params.episode],
  request: episodeStatsRequest,
  mapper: mapStatsResponseToEpisodeStats,
  schema: EpisodeStatsSchema,
  ttl: time.minutes(30),
});
