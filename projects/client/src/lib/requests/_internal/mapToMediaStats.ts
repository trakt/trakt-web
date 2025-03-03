import type { MovieStatsResponse, ShowStatsResponse } from '@trakt/api';
import type { MediaStats } from '../models/MediaStats.ts';
import { mapToEpisodeStats } from './mapToEpisodeStats.ts';

export function mapToMediaStats(
  stats: MovieStatsResponse | ShowStatsResponse,
): MediaStats {
  return {
    ...mapToEpisodeStats(stats),
    votes: stats.votes,
    favorited: stats.favorited,
  };
}
