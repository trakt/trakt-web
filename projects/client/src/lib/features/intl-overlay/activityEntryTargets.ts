import { makeTargets } from './makeTargets.ts';

type ActivityMovie = {
  type: 'movie';
  movie: { id: number; title: string };
};

type ActivityShow = {
  type: 'show' | 'episode';
  show: { id: number; title: string };
  episode: { id: number; title: string };
};

type Activity = ActivityMovie | ActivityShow;

/**
 * Targets for history/activity entries discriminated by `entry.type`:
 * `movie` rows carry `entry.movie`; `show`/`episode` rows carry both
 * `entry.show` and `entry.episode`.
 */
export const activityEntryTargets = <T extends Activity>(entry: T) =>
  makeTargets<T>(
    {
      get: (e) => e.type === 'movie' ? { id: e.movie.id, type: 'movie' } : null,
      patch: (e, title) =>
        e.type === 'movie' ? ({ ...e, movie: { ...e.movie, title } } as T) : e,
    },
    {
      get: (e) => e.type !== 'movie' ? { id: e.show.id, type: 'show' } : null,
      patch: (e, title) =>
        e.type !== 'movie' ? ({ ...e, show: { ...e.show, title } } as T) : e,
    },
    {
      get: (e) =>
        e.type !== 'movie' ? { id: e.episode.id, type: 'episode' } : null,
      patch: (e, title) =>
        e.type !== 'movie'
          ? ({ ...e, episode: { ...e.episode, title } } as T)
          : e,
    },
  )(entry);
