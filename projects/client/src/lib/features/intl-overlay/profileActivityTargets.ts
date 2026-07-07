import { makeTargets } from './makeTargets.ts';

type RatingMovie = {
  activityType: 'ratings';
  type: 'movie';
  movie: { id: number; title: string };
};

type RatingShow = {
  activityType: 'ratings';
  type: 'show';
  show: { id: number; title: string };
};

type RatingEpisode = {
  activityType: 'ratings';
  type: 'episode';
  show: { id: number; title: string };
  episode: { id: number; title: string };
};

type RatingSeason = {
  activityType: 'ratings';
  type: 'season';
  show: { id: number; title: string };
};

type ReviewMovieOrShow = {
  activityType: 'reviews';
  type: 'movie' | 'show';
  media: { id: number; title: string };
};

type ReviewEpisode = {
  activityType: 'reviews';
  type: 'episode';
  media: { id: number; title: string };
  episode: { id: number; title: string };
};

type ProfileActivity =
  | RatingMovie
  | RatingShow
  | RatingEpisode
  | RatingSeason
  | ReviewMovieOrShow
  | ReviewEpisode;

/**
 * Targets for profile activity entries (ratings + reviews).
 * Discriminates on `activityType` first, then `type`:
 * - ratings carry titles in `movie`, `show`, `season`, or `episode` fields.
 * - reviews carry the main entity title in `media` and optionally `episode`.
 */
export const profileActivityTargets = <T extends ProfileActivity>(entry: T) =>
  makeTargets<T>(
    {
      get: (e) =>
        e.activityType === 'ratings' && e.type === 'movie'
          ? { id: e.movie.id, type: 'movie' }
          : null,
      patch: (e, title) =>
        e.activityType === 'ratings' && e.type === 'movie'
          ? ({ ...e, movie: { ...e.movie, title } } as T)
          : e,
    },
    {
      get: (e) =>
        e.activityType === 'ratings' && e.type === 'show'
          ? { id: e.show.id, type: 'show' }
          : null,
      patch: (e, title) =>
        e.activityType === 'ratings' && e.type === 'show'
          ? ({ ...e, show: { ...e.show, title } } as T)
          : e,
    },
    {
      get: (e) =>
        e.activityType === 'ratings' && e.type === 'episode'
          ? { id: e.show.id, type: 'show' }
          : null,
      patch: (e, title) =>
        e.activityType === 'ratings' && e.type === 'episode'
          ? ({ ...e, show: { ...e.show, title } } as T)
          : e,
    },
    {
      get: (e) =>
        e.activityType === 'ratings' && e.type === 'episode'
          ? { id: e.episode.id, type: 'episode' }
          : null,
      patch: (e, title) =>
        e.activityType === 'ratings' && e.type === 'episode'
          ? ({ ...e, episode: { ...e.episode, title } } as T)
          : e,
    },
    {
      get: (e) =>
        e.activityType === 'ratings' && e.type === 'season'
          ? { id: e.show.id, type: 'show' }
          : null,
      patch: (e, title) =>
        e.activityType === 'ratings' && e.type === 'season'
          ? ({ ...e, show: { ...e.show, title } } as T)
          : e,
    },
    {
      get: (e) =>
        e.activityType === 'reviews' && e.type !== 'episode'
          ? { id: e.media.id, type: e.type }
          : null,
      patch: (e, title) =>
        e.activityType === 'reviews' && e.type !== 'episode'
          ? ({ ...e, media: { ...e.media, title } } as T)
          : e,
    },
    {
      get: (e) =>
        e.activityType === 'reviews' && e.type === 'episode'
          ? { id: e.media.id, type: 'show' }
          : null,
      patch: (e, title) =>
        e.activityType === 'reviews' && e.type === 'episode'
          ? ({ ...e, media: { ...e.media, title } } as T)
          : e,
    },
    {
      get: (e) =>
        e.activityType === 'reviews' && e.type === 'episode'
          ? { id: e.episode.id, type: 'episode' }
          : null,
      patch: (e, title) =>
        e.activityType === 'reviews' && e.type === 'episode'
          ? ({ ...e, episode: { ...e.episode, title } } as T)
          : e,
    },
  )(entry);
