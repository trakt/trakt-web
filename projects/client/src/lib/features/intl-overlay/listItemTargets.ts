import { makeTargets } from './makeTargets.ts';

type ListMovieOrShow = {
  type: 'movie' | 'show';
  entry: { id: number; title: string };
};

type ListEpisode = {
  type: 'episode';
  entry: {
    show: { id: number; title: string };
    episode: { id: number; title: string };
  };
};

type ListSeason = {
  type: 'season';
  entry: { show: { id: number; title: string } };
};

type ListUnion = ListMovieOrShow | ListEpisode | ListSeason;

/**
 * Targets for the ListItem discriminated union as it ships from
 * watchlist / personal-list endpoints (movie/show/episode/season,
 * with the media nested under `entry`).
 */
export const listItemTargets = <T extends ListUnion>(item: T) =>
  makeTargets<T>(
    {
      get: (e) =>
        e.type === 'movie' || e.type === 'show'
          ? { id: e.entry.id, type: e.type }
          : null,
      patch: (e, title) =>
        e.type === 'movie' || e.type === 'show'
          ? ({ ...e, entry: { ...e.entry, title } } as T)
          : e,
    },
    {
      get: (e) =>
        e.type === 'episode' ? { id: e.entry.show.id, type: 'show' } : null,
      patch: (e, title) =>
        e.type === 'episode'
          ? ({
            ...e,
            entry: { ...e.entry, show: { ...e.entry.show, title } },
          } as T)
          : e,
    },
    {
      get: (e) =>
        e.type === 'episode'
          ? { id: e.entry.episode.id, type: 'episode' }
          : null,
      patch: (e, title) =>
        e.type === 'episode'
          ? ({
            ...e,
            entry: { ...e.entry, episode: { ...e.entry.episode, title } },
          } as T)
          : e,
    },
    {
      get: (e) =>
        e.type === 'season' ? { id: e.entry.show.id, type: 'show' } : null,
      patch: (e, title) =>
        e.type === 'season'
          ? ({
            ...e,
            entry: { ...e.entry, show: { ...e.entry.show, title } },
          } as T)
          : e,
    },
  )(item);
