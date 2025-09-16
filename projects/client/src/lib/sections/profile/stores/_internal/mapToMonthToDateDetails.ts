import type { EpisodeActivityHistory } from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import {
  type MovieActivityHistory,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { DEFAULT_COVER } from '$lib/utils/constants.ts';
import { episodeActivityTitle } from '$lib/utils/intl/episodeActivityTitle.ts';
import type { MonthToDateDetails } from '../../models/MonthToDateDetails.ts';

function mapToCover(activity: MovieActivityHistory | EpisodeActivityHistory) {
  const media = activity.type === 'movie' ? activity.movie : activity.show;
  return media.cover?.url.thumb || DEFAULT_COVER;
}

function mapToTitle(activity: MovieActivityHistory | EpisodeActivityHistory) {
  return activity.type === 'movie'
    ? activity.movie.title
    : episodeActivityTitle(activity.episode, activity.show);
}

const NOTHING_WATCHED_DETAILS: MonthToDateDetails = {
  movieCount: 0,
  showCount: 0,
  episodeCount: 0,
  coverUrl: DEFAULT_COVER,
} as const;

export function mapToMonthToDateDetails(
  movies: MovieActivityHistory[],
  episodes: EpisodeActivityHistory[],
): MonthToDateDetails {
  const allActivity = [...movies, ...episodes]
    .toSorted((a, b) => {
      return a.watchedAt.getTime() - b.watchedAt.getTime();
    });

  if (allActivity.length === 0) {
    return NOTHING_WATCHED_DETAILS;
  }

  const movieCount = movies.length;
  const episodeCount = episodes.length;
  const showCount =
    new Set(episodes.map((activity) => activity.show.slug)).size;

  const firstWatchActivity = assertDefined(allActivity.at(0));
  return {
    movieCount,
    showCount,
    episodeCount,
    coverUrl: mapToCover(firstWatchActivity),
    firstWatchedTitle: mapToTitle(firstWatchActivity),
  };
}
