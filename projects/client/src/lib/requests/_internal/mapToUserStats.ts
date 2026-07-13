import type { UserStats } from '$lib/requests/models/UserStats.ts';
import type { UserStatsResponse } from '@trakt/api';

export function mapToUserStats(response: UserStatsResponse): UserStats {
  const { movies, shows, episodes, seasons, ratings } = response;

  return {
    playCount: movies.plays + episodes.plays,
    minuteCount: movies.minutes + episodes.minutes,
    movieCount: movies.watched,
    showCount: shows.watched,
    episodeCount: episodes.watched,
    commentCount: movies.comments + shows.comments + episodes.comments +
      seasons.comments,
    ratingCount: ratings.total,
  };
}
