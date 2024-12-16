import type { MovieStatsResponse, ShowStatsResponse } from '$lib/api.ts';
import type { MediaStats } from '$lib/models/MediaStats.ts';

export function mapStatsResponseToMediaStats(
  stats: MovieStatsResponse | ShowStatsResponse,
): MediaStats {
  return {
    watchers: stats.watchers,
    plays: stats.plays,
    collectors: stats.collectors,
    comments: stats.comments,
    lists: stats.lists,
    votes: stats.votes,
    favorited: stats.favorited,
  };
}
