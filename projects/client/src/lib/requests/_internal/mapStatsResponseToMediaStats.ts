import type { MovieStatsResponse, ShowStatsResponse } from '$lib/api.ts';
import type { MediaStats } from '../models/MediaStats.ts';
import { mapStatsResponseToEpisodeStats } from './mapStatsResponseToEpisodeStats.ts';

export function mapStatsResponseToMediaStats(
  stats: MovieStatsResponse | ShowStatsResponse,
): MediaStats {
  return {
    ...mapStatsResponseToEpisodeStats(stats),
    votes: stats.votes,
    favorited: stats.favorited,
  };
}
