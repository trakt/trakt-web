import type { UpNextSortBy } from '$lib/sections/lists/progress/UpNextSortBy.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import type { MovieProgressEntry } from '../../../models/MovieProgressEntry.ts';
import type { UpNextEntry } from '../../../models/UpNextEntry.ts';
import { sortMovieProgress } from './sortMovieProgress.ts';

type SortMediaProgressProps = {
  episodes: UpNextEntry[];
  movies: MovieProgressEntry[];
  sortBy?: UpNextSortBy;
  sortHow?: SortDirection;
};

function getComparableValues(
  movie: MovieProgressEntry,
  episode: UpNextEntry,
  sortBy: UpNextSortBy,
): [number, number] {
  switch (sortBy) {
    case 'released':
      return [
        movie.effectiveReleaseDate.getTime(),
        episode.effectiveReleaseDate.getTime(),
      ];
    case 'remaining':
      return [0, episode.remaining];
  }
}

function shouldInsertBefore(
  movie: MovieProgressEntry,
  episode: UpNextEntry,
  sortBy: UpNextSortBy | undefined,
  direction: number,
): boolean {
  if (!sortBy) {
    const date = movie.lastWatchedAt;
    if (!date) return false;
    const episodeDate = episode.lastWatchedAt;
    return direction === 1
      ? !episodeDate || date < episodeDate
      : !episodeDate || date > episodeDate;
  }

  const [movieValue, episodeValue] = getComparableValues(
    movie,
    episode,
    sortBy,
  );
  return (movieValue - episodeValue) * direction < 0;
}

export function interleaveMediaProgress(
  { episodes, movies, sortBy, sortHow = 'desc' }: SortMediaProgressProps,
) {
  const sortedMovies = sortBy
    ? sortMovieProgress({ entries: movies, sortBy, sortHow })
    : movies;

  const direction = sortHow === 'asc' ? 1 : -1;

  const { result, insertedKeys } = episodes.reduce(
    (acc, episode) => {
      const moviesToInsert = sortedMovies.filter((movie) => {
        if (acc.insertedKeys.has(movie.key)) return false;

        const insert = shouldInsertBefore(movie, episode, sortBy, direction);

        if (insert) acc.insertedKeys.add(movie.key);
        return insert;
      });

      return {
        result: [...acc.result, ...moviesToInsert, episode],
        insertedKeys: acc.insertedKeys,
      };
    },
    {
      result: [] as (UpNextEntry | MovieProgressEntry)[],
      insertedKeys: new Set<string>(),
    },
  );

  const remainingMovies = sortedMovies.filter((movie) =>
    !insertedKeys.has(movie.key)
  );

  return [...result, ...remainingMovies];
}
