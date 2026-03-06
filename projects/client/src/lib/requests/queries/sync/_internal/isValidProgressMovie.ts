import type { MovieProgressEntry } from '../../../models/MovieProgressEntry.ts';

export function isValidProgressMovie(movie: MovieProgressEntry) {
  const hasAired = movie.airDate <= new Date();

  if (!('progress' in movie)) {
    return hasAired;
  }

  /**
   * FIXME: remove once the DB accurately tracks progress
   */
  const hasProgress = isNaN(movie.progress) || movie.minutesElapsed > 5;
  return hasAired && hasProgress;
}
