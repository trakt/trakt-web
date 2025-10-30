import type { MovieProgressEntry } from '../movieProgressQuery.ts';

export function isValidProgressMovie(movie: MovieProgressEntry) {
  const hasAired = movie.airDate <= new Date();
  /**
   * FIXME: remove once the DB accurately tracks progress
   */
  const hasProgress = isNaN(movie.progress) || movie.minutesElapsed > 5;
  return hasAired && hasProgress;
}
