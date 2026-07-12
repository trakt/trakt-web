import type { OfflineAction } from '../models/OfflineAction.ts';
import type { FreshWatchedState } from './FreshWatchedState.ts';

type FindDuplicateWatchParams = {
  action: OfflineAction;
  watched: FreshWatchedState;
};

function toWatchedAt(
  key: string,
  watched: FreshWatchedState,
): Date | undefined {
  const [type, rawId] = key.split(':');
  const id = Number(rawId);

  switch (type) {
    case 'movie':
      return watched.movies.get(id);
    case 'show':
      return watched.shows.get(id);
    case 'episode':
      return watched.episodes.get(id);
    default:
      return undefined;
  }
}

/**
 * A queued watch is a duplicate when the server recorded a play for one of
 * its targets after it was queued (same thing watched from another device).
 */
export function findDuplicateWatch(
  { action, watched }: FindDuplicateWatchParams,
): boolean {
  if (action.endpoint !== 'history:add') {
    return false;
  }

  return action.keys.some((key) => {
    const watchedAt = toWatchedAt(key, watched);
    return watchedAt != null && watchedAt.getTime() >= action.queuedAt;
  });
}
