import { makeTargets } from './makeTargets.ts';

type Titled = { id: number; title: string };

type EpisodeWithShow = Titled & {
  show: { id: number; title: string };
};

/**
 * Targets for entries that are either an episode carrying its
 * embedded `.show` (the episode title sits at the entry root) or a
 * standalone movie entry. Covers calendar/upcoming/releases rows
 * and up-next progress rows where the API mixes both shapes in a
 * single list.
 */
export const episodeWithShowOrMovieTargets = <
  T extends Titled | EpisodeWithShow,
>(
  entry: T,
) =>
  makeTargets<T>(
    {
      get: (e) => 'show' in e ? { id: e.show.id, type: 'show' } : null,
      patch: (e, title) =>
        'show' in e ? ({ ...e, show: { ...e.show, title } } as T) : e,
    },
    {
      get: (e) => 'show' in e ? { id: e.id, type: 'episode' } : null,
      patch: (e, title) => 'show' in e ? ({ ...e, title } as T) : e,
    },
    {
      get: (e) => 'show' in e ? null : { id: e.id, type: 'movie' },
      patch: (e, title) => ({ ...e, title } as T),
    },
  )(entry);
