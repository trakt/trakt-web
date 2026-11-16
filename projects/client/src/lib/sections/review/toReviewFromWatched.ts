import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { toMediaImageUrl } from '$lib/utils/url/toMediaImageUrl.ts';
import type { Review } from './models/Review.ts';
import type { ReviewTitle } from './models/ReviewTitle.ts';

type ToReviewFromWatchedParams = {
  history: UserHistory;
  startDate: Date;
  endDate: Date;
};

type WatchedTitle = {
  type: MediaType;
  id: number;
  dates: ReadonlyArray<Date>;
};

const IMAGE_TYPE = { movie: 'movies', show: 'shows' } as const;

const toLatest = ({ dates }: WatchedTitle) =>
  Math.max(...dates.map((date) => date.getTime()));

const countPlays = (titles: ReadonlyArray<WatchedTitle>) =>
  titles.reduce((total, title) => total + title.dates.length, 0);

function toTitle({ type, id, dates }: WatchedTitle): ReviewTitle {
  const imageType = IMAGE_TYPE[type];

  return {
    key: `${type}-${id}`,
    id,
    type,
    slug: `${id}`,
    title: '',
    poster: toMediaImageUrl({
      type: imageType,
      id,
      slot: 'poster',
      size: 'medium',
    }),
    cover: toMediaImageUrl({
      type: imageType,
      id,
      slot: 'fanart',
      size: 'medium',
    }),
    plays: dates.length,
  };
}

export function toReviewFromWatched({
  history,
  startDate,
  endDate,
}: ToReviewFromWatchedParams): Review {
  const inRange = (dates: ReadonlyArray<Date>) =>
    dates.filter((date) => date >= startDate && date < endDate);

  const movies = [...history.movies.values()]
    .map(({ id, watchedDates }) => ({
      type: 'movie' as const,
      id,
      dates: inRange(watchedDates),
    }))
    .filter((title) => title.dates.length > 0);
  const shows = [...history.shows.values()]
    .map(({ id, watchedDates }) => ({
      type: 'show' as const,
      id,
      dates: inRange(watchedDates),
    }))
    .filter((title) => title.dates.length > 0);
  const watched = [...movies, ...shows];

  return {
    tier: 'free',
    plays: countPlays(watched),
    episodes: countPlays(shows),
    movies: movies.length,
    shows: shows.length,
    activeDays: new Set(
      watched.flatMap((title) => title.dates).map((date) => getDayKey(date)),
    ).size,
    titles: watched
      .map((title) => ({ title, latest: toLatest(title) }))
      .toSorted((a, b) => b.latest - a.latest)
      .map(({ title }) => toTitle(title)),
  };
}
