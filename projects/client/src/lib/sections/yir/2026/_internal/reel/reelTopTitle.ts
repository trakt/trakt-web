import type {
  YirDetail,
  YirMostWatchedItem,
} from '$lib/requests/models/YirDetail.ts';

export function reelTopTitle(
  detail: YirDetail | null,
): YirMostWatchedItem | null {
  if (!detail) return null;

  const show = detail.mostWatched.shows.at(0);
  const movie = detail.mostWatched.movies.at(0);

  if (!show) return movie ?? null;
  if (!movie) return show;

  return show.plays >= movie.plays ? show : movie;
}
