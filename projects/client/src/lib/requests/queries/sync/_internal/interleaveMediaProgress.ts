import type { MediaProgressIntent } from '../mediaProgressQuery.ts';
import type { MovieProgressEntry } from '../movieProgressQuery.ts';
import type { UpNextEntry } from '../upNextNitroQuery.ts';

type SortMediaProgressProps = {
  intent: MediaProgressIntent;
  episodes: UpNextEntry[];
  movies: MovieProgressEntry[];
};

function getEpisodeDate(intent: MediaProgressIntent, episode: UpNextEntry) {
  return intent === 'start' ? episode.show.airDate : episode.lastWatchedAt;
}

function getMovieDate(intent: MediaProgressIntent, movie: MovieProgressEntry) {
  return intent === 'start' ? movie.airDate : movie.lastWatchedAt;
}

export function interleaveMediaProgress(props: SortMediaProgressProps) {
  const { intent, episodes, movies } = props;

  const { result, insertedKeys } = episodes.reduce(
    (acc, episode) => {
      const episodeDate = getEpisodeDate(intent, episode);

      const moviesToInsert = movies
        .filter((movie) => {
          const date = getMovieDate(intent, movie);
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
