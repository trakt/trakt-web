import type { EpisodeActivityHistory } from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { DEFAULT_COVER } from '$lib/utils/constants.ts';
import type { MonthToDateDetails } from '../../models/MonthToDateDetails.ts';

type MapToMonthToDateDetailsParams = {
  movies: MovieActivityHistory[];
  episodes: EpisodeActivityHistory[];
  ratingCount?: number;
};

function mapToCover(activity: MovieActivityHistory | EpisodeActivityHistory) {
  const media = activity.type === 'movie' ? activity.movie : activity.show;
  return media.cover?.url.thumb || DEFAULT_COVER;
}

function sumRuntime(
  movies: MovieActivityHistory[],
  episodes: EpisodeActivityHistory[],
): number {
  // Mappers default a missing runtime to NaN, so coerce to 0 before summing to
  // keep the total a real number.
  const runtimeOf = (value: number) => Number.isNaN(value) ? 0 : value;
  const movieMinutes = movies.reduce(
    (sum, m) => sum + runtimeOf(m.movie.runtime),
    0,
  );
  const episodeMinutes = episodes.reduce(
    (sum, e) => sum + runtimeOf(e.episode.runtime),
    0,
  );
  return movieMinutes + episodeMinutes;
}

export function mapToMonthToDateDetails(
  { movies, episodes, ratingCount }: MapToMonthToDateDetailsParams,
): MonthToDateDetails {
  const allActivity = [...movies, ...episodes]
    .toSorted((a, b) => {
      return a.watchedAt.getTime() - b.watchedAt.getTime();
    });

  const movieCount = movies.length;
  const episodeCount = episodes.length;
  const showCount =
    new Set(episodes.map((activity) => activity.show.slug)).size;

  const firstWatchActivity = allActivity.at(0);
  return {
    // Each movie / episode activity entry represents a single play this month.
    playCount: movieCount + episodeCount,
    movieCount,
    showCount,
    episodeCount,
    minuteCount: sumRuntime(movies, episodes),
    ratingCount,
    coverUrl: firstWatchActivity
      ? mapToCover(firstWatchActivity)
      : DEFAULT_COVER,
  };
}
