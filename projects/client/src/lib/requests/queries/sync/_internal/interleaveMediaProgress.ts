import type { MovieProgressEntry } from '../../../models/MovieProgressEntry.ts';
import type { UpNextEntry } from '../../../models/UpNextEntry.ts';

type SortMediaProgressProps = {
  episodes: UpNextEntry[];
  movies: MovieProgressEntry[];
};

function getEpisodeDate(episode: UpNextEntry) {
  return episode.intent === 'start'
    ? episode.effectiveReleaseDate
    : episode.lastWatchedAt;
}

function getMovieDate(movie: MovieProgressEntry) {
  return movie.intent === 'start' ? movie.airDate : movie.lastWatchedAt;
}

export function interleaveMediaProgress(props: SortMediaProgressProps) {
  const { episodes, movies } = props;

  const { result, insertedKeys } = episodes.reduce(
    (acc, episode) => {
      const episodeDate = getEpisodeDate(episode);

      const moviesToInsert = movies
        .filter((movie) => {
          const date = getMovieDate(movie);
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
