import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type {
  RatingDistribution,
  UserStats,
} from '$lib/requests/models/UserStats.ts';

type ComputeUserStatsInput = {
  history: UserHistory;
  ratings: UserRatings;
};

const emptyDistribution = (): RatingDistribution => ({
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
});

function toDistribution(ratings: UserRatings): RatingDistribution {
  const maps = [
    ratings.movies,
    ratings.shows,
    ratings.seasons,
    ratings.episodes,
  ];

  return maps
    .flatMap((map) => Array.from(map.values()))
    .reduce((acc, entry) => {
      const bucket = entry.rating as keyof RatingDistribution;
      if (acc[bucket] != null) {
        acc[bucket] += 1;
      }
      return acc;
    }, emptyDistribution());
}

/**
 * Client-side fallback for the `/users/:id/stats` shape, used when a free user
 * views their OWN profile (the endpoint returns `404` for free accounts).
 *
 * Only the metrics derivable from the loaded history + ratings are populated;
 * server-only aggregates (minutes, comments, network, progress, lists) stay `0`
 * and the panel hides zero-valued stats rather than surfacing misleading data.
 */
export function computeUserStats(
  { history, ratings }: ComputeUserStatsInput,
): UserStats {
  const moviePlays = Array.from(history.movies.values()).reduce(
    (sum, movie) => sum + movie.plays,
    0,
  );

  const shows = Array.from(history.shows.values());
  const episodeWatched = shows.reduce(
    (sum, show) => sum + show.episodes.length,
    0,
  );
  const episodePlays = shows.reduce(
    (sum, show) =>
      sum + show.episodes.reduce((epSum, ep) => epSum + ep.plays, 0),
    0,
  );

  const ratingsTotal = ratings.movies.size + ratings.shows.size +
    ratings.seasons.size + ratings.episodes.size;

  return {
    movies: {
      plays: moviePlays,
      watched: history.movies.size,
      minutes: 0,
      ratings: ratings.movies.size,
      comments: 0,
    },
    shows: {
      watched: history.shows.size,
      ratings: ratings.shows.size,
      comments: 0,
    },
    seasons: {
      ratings: ratings.seasons.size,
      comments: 0,
    },
    episodes: {
      plays: episodePlays,
      watched: episodeWatched,
      minutes: 0,
      ratings: ratings.episodes.size,
      comments: 0,
    },
    network: {
      followers: 0,
      following: 0,
    },
    ratings: {
      total: ratingsTotal,
      distribution: toDistribution(ratings),
    },
    progress: {
      started: 0,
      finished: 0,
      dropped: 0,
    },
    lists: 0,
    totalMinutes: 0,
    totalPlays: moviePlays + episodePlays,
  };
}
