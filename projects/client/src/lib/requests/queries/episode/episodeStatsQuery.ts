import type { MediaStats } from '$lib/models/MediaStats.ts';
import { mapStatsResponseToMediaStats } from '$lib/requests/_internal/mapStatsResponseToMediaStats.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type EpisodeStatsQueryParams = {
  slug: string;
  season: number;
  episode: number;
} & ApiParams;

export function episodeStatsRequest(
  { fetch, slug, season, episode }: EpisodeStatsQueryParams,
): Promise<MediaStats> {
  return api({ fetch })
    .shows
    .episode
    .stats({
      params: {
        id: slug,
        season,
        episode,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch episode stats');
      }

      return mapStatsResponseToMediaStats(body);
    });
}

export const episodeStatsQueryKey = (params: EpisodeStatsQueryParams) =>
  ['episodeStats', params.slug, params.season, params.episode] as const;
export const episodeStatsQuery = (
  params: EpisodeStatsQueryParams,
) => ({
  queryKey: episodeStatsQueryKey(params),
  queryFn: () => episodeStatsRequest(params),
});
