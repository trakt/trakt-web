import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapStatsResponseToMediaStats } from '$lib/requests/_internal/mapStatsResponseToMediaStats.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaStatsSchema } from '$lib/requests/models/MediaStats.ts';
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
  mapper: mapStatsResponseToMediaStats,
  schema: MediaStatsSchema,
  ttl: time.minutes(30),
});
