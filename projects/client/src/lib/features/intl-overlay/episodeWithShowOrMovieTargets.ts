import { makeTargets } from './makeTargets.ts';

type Titled = {
  id: number;
  title: string;
};

type EpisodeWithShow = Titled & {
  show: { id: number; title: string };
};

/**
 * Targets for entries that are either an episode carrying its
 * embedded `.show` (the episode title sits at the entry root) or a
 * standalone media entry (movie or show). Covers calendar / upcoming
 * / releases rows and up-next progress rows where the API mixes both
 * shapes in a single list. Standalone rows expose their kind via
 * `entry.type` (MediaEntry / MovieEntry / ShowEntry) so the helper
 * falls back to that rather than assuming "movie".
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
      get: (e) => {
        if ('show' in e) return null;
        const standaloneType =
          'type' in e && (e as { type?: unknown }).type === 'show'
            ? 'show'
            : 'movie';
        return { id: e.id, type: standaloneType };
      },
      patch: (e, title) => ({ ...e, title } as T),
    },
  )(entry);
