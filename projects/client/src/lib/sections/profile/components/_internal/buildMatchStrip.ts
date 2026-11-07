import type { UserMatch } from '$lib/requests/models/UserMatch.ts';

export type MatchStripEntry = {
  key: string;
  id: number;
  type: 'movie' | 'show';
  isFavorite: boolean;
};

export const MATCH_STRIP_LIMIT = 12;

function interleave<T>(first: T[], second: T[]): T[] {
  const length = Math.max(first.length, second.length);

  return Array.from({ length }, (_, index) => [
    first.at(index),
    second.at(index),
  ])
    .flat()
    .filter((item): item is T => item !== undefined);
}

export function buildMatchStrip(
  shared: UserMatch['shared'],
  limit = MATCH_STRIP_LIMIT,
): MatchStripEntry[] {
  const source = shared.watched ?? shared.favorites;
  const favoriteMovies = new Set(shared.favorites.movies);
  const favoriteShows = new Set(shared.favorites.shows);

  const movies = source.movies.map(
    (id): MatchStripEntry => ({
      key: `movie-${id}`,
      id,
      type: 'movie',
      isFavorite: favoriteMovies.has(id),
    }),
  );
  const shows = source.shows.map(
    (id): MatchStripEntry => ({
      key: `show-${id}`,
      id,
      type: 'show',
      isFavorite: favoriteShows.has(id),
    }),
  );

  const entries = interleave(movies, shows);

  return [
    ...entries.filter((entry) => entry.isFavorite),
    ...entries.filter((entry) => !entry.isFavorite),
  ].slice(0, limit);
}
