import type { SortBy } from '$lib/sections/lists/user/models/SortBy.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import type { MovieProgressEntry } from '../../../models/MovieProgressEntry.ts';
import type { UpNextEntry } from '../../../models/UpNextEntry.ts';

type InterleaveMediaProgressProps = {
  episodes: UpNextEntry[];
  movies: MovieProgressEntry[];
  sortBy?: SortBy;
  sortHow?: SortDirection;
};

function getEpisodeValue(episode: UpNextEntry, sortBy: SortBy): number {
  switch (sortBy) {
    case 'released':
      return episode.show.effectiveReleaseDate.getTime();
    case 'remaining':
      return episode.minutesLeft;
    default:
      return (episode.lastWatchedAt ?? new Date(0)).getTime();
  }
}

function getMovieValue(movie: MovieProgressEntry, sortBy: SortBy): number {
  switch (sortBy) {
    case 'released':
      return movie.effectiveReleaseDate.getTime();
    case 'remaining':
      return movie.minutesLeft;
    default:
      return (movie.lastWatchedAt ?? new Date(0)).getTime();
  }
}

function sortMovies(
  movies: MovieProgressEntry[],
  sortBy: SortBy,
  sortHow: SortDirection,
): MovieProgressEntry[] {
  const direction = sortHow === 'asc' ? 1 : -1;
  return [...movies].sort(
    (a, b) => (getMovieValue(a, sortBy) - getMovieValue(b, sortBy)) * direction,
  );
}

export function interleaveMediaProgress({
  episodes,
  movies,
  sortBy,
  sortHow = 'asc',
}: InterleaveMediaProgressProps) {
  if (!sortBy) {
    // Default: interleave by lastWatchedAt — movies without a date fall to the end
    const { result, insertedKeys } = episodes.reduce(
      (acc, episode) => {
        const episodeDate = episode.lastWatchedAt;

        const moviesToInsert = movies.filter((movie) => {
          const date = movie.lastWatchedAt;
          if (acc.insertedKeys.has(movie.key) || !date) return false;
          const isMoreRecent = !episodeDate || date > episodeDate;
          isMoreRecent && acc.insertedKeys.add(movie.key);
          return isMoreRecent;
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

    const remainingMovies = movies.filter((movie) =>
      !insertedKeys.has(movie.key)
    );
    return [...result, ...remainingMovies];
  }

  // Sort-aware: pre-sort movies, then insert each movie before the first episode
  // whose sort value exceeds (asc) or is less than (desc) the movie's value.
  const sorted = sortMovies(movies, sortBy, sortHow);

  const { result, insertedKeys } = episodes.reduce(
    (acc, episode) => {
      const episodeValue = getEpisodeValue(episode, sortBy);

      const moviesToInsert = sorted.filter((movie) => {
        if (acc.insertedKeys.has(movie.key)) return false;
        const movieValue = getMovieValue(movie, sortBy);
        const shouldInsertBefore = sortHow === 'asc'
          ? movieValue <= episodeValue
          : movieValue >= episodeValue;
        if (shouldInsertBefore) acc.insertedKeys.add(movie.key);
        return shouldInsertBefore;
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

  const remainingMovies = sorted.filter((movie) =>
    !insertedKeys.has(movie.key)
  );
  return [...result, ...remainingMovies];
}
