import type { FollowingActivity } from '$lib/requests/models/FollowingActivity.ts';
import { makeTargets } from './makeTargets.ts';

type Target = FollowingActivity['target'];

function withTarget(entry: FollowingActivity, target: Target) {
  return { ...entry, target };
}

export const followingActivityTargets = makeTargets<FollowingActivity>(
  {
    get: ({ target }) =>
      target.type === 'movie' ? { id: target.movie.id, type: 'movie' } : null,
    patch: (entry, title) =>
      entry.target.type === 'movie'
        ? withTarget(entry, {
          ...entry.target,
          movie: { ...entry.target.movie, title },
        })
        : entry,
  },
  {
    get: ({ target }) =>
      target.type !== 'movie' ? { id: target.show.id, type: 'show' } : null,
    patch: (entry, title) =>
      entry.target.type !== 'movie'
        ? withTarget(entry, {
          ...entry.target,
          show: { ...entry.target.show, title },
        })
        : entry,
  },
  {
    get: ({ target }) =>
      target.type === 'episode'
        ? { id: target.episode.id, type: 'episode' }
        : null,
    patch: (entry, title) =>
      entry.target.type === 'episode'
        ? withTarget(entry, {
          ...entry.target,
          episode: { ...entry.target.episode, title },
        })
        : entry,
  },
);
