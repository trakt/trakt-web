import type { MovieProgressEntry } from '../../../models/MovieProgressEntry.ts';
import type { UpNextEntry } from '../../../models/UpNextEntry.ts';

type SortMediaProgressProps = {
  episodes: UpNextEntry[];
  movies: MovieProgressEntry[];
};

export function interleaveMediaProgress(props: SortMediaProgressProps) {
  const { episodes, movies } = props;

  const { result, insertedKeys } = episodes.reduce(
    (acc, episode) => {
      const episodeDate = episode.lastWatchedAt;

      const moviesToInsert = movies
        .filter((movie) => {
          const date = movie.lastWatchedAt;
          if (acc.insertedKeys.has(movie.key) || !date) {
            return false;
          }

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

  const remainingMovies = movies.filter((movie) => {
    return !insertedKeys.has(movie.key);
  });

  return [...result, ...remainingMovies];
}
