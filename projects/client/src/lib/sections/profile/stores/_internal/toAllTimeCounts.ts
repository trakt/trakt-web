import type { UserStats } from '$lib/requests/models/UserStats.ts';
import type { AllTimeStatsDetails } from '../../models/AllTimeStatsDetails.ts';

const EMPTY_COUNTS: AllTimeStatsDetails = {
  playCount: 0,
  minuteCount: 0,
  movieCount: 0,
  showCount: 0,
  episodeCount: 0,
  commentCount: 0,
  ratingCount: 0,
  listCount: null,
  startedCount: null,
  finishedCount: null,
  droppedCount: null,
};

export function toAllTimeCounts(stats: UserStats | Nil): AllTimeStatsDetails {
  if (!stats) {
    return EMPTY_COUNTS;
  }

  const { movies, shows, seasons, episodes, ratings, progress } = stats;

  return {
    playCount: stats.totalPlays,
    minuteCount: stats.totalMinutes,
    movieCount: movies.watched,
    showCount: shows.watched,
    episodeCount: episodes.watched,
    commentCount: movies.comments + shows.comments + seasons.comments +
      episodes.comments,
    ratingCount: ratings.total,
    listCount: stats.lists,
    startedCount: progress?.started ?? null,
    finishedCount: progress?.finished ?? null,
    droppedCount: progress?.dropped ?? null,
  };
}
