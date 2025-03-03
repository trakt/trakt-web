import type { EpisodeStatsResponse } from '@trakt/api';
import type { EpisodeStats } from '../models/EpisodeStats.ts';

export function mapToEpisodeStats(
  stats: EpisodeStatsResponse,
): EpisodeStats {
  return {
    watchers: stats.watchers,
    plays: stats.plays,
    collectors: stats.collectors,
    comments: stats.comments,
    lists: stats.lists,
  };
}
