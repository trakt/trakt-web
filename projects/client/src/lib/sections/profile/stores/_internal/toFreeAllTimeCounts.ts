import type { UserStats } from '$lib/requests/models/UserStats.ts';
import type { AllTimeStatsDetails } from '../../models/AllTimeStatsDetails.ts';

type ToFreeAllTimeCountsParams = {
  stats: UserStats;
  commentCount: number | Nil;
};

export function toFreeAllTimeCounts({
  stats,
  commentCount,
}: ToFreeAllTimeCountsParams): AllTimeStatsDetails {
  return {
    playCount: stats.totalPlays,
    minuteCount: null,
    movieCount: stats.movies.watched,
    showCount: stats.shows.watched,
    episodeCount: stats.episodes.watched,
    commentCount: commentCount ?? 0,
    ratingCount: stats.ratings.total,
    listCount: null,
    startedCount: null,
    finishedCount: null,
    droppedCount: null,
  };
}
