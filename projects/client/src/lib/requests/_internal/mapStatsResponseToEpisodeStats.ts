import type { EpisodeStatsResponse } from '$lib/api.ts';
import type { EpisodeStats } from '../models/EpisodeStats.ts';

export function mapStatsResponseToEpisodeStats(
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
