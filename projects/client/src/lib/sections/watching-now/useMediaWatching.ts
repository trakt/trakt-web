import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaSocialQueryTarget } from '$lib/requests/queries/media/mediaSocialQuery.ts';
import { mediaWatchingQuery } from '$lib/requests/queries/media/mediaWatchingQuery.ts';
import { followingQuery } from '$lib/requests/queries/users/followingQuery.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
  shareReplay,
} from 'rxjs';
import { useWatchingFanOut } from './_internal/useWatchingFanOut.ts';
import { WATCHING_NOW_POLL_INTERVAL } from './_internal/WATCHING_NOW_POLL_INTERVAL.ts';

const FOLLOWED_LIMIT = 5;

export function useMediaWatching(target: Observable<MediaSocialQueryTarget>) {
  const watchers = useQuery(
    target.pipe(
      map(($target) => ({
        ...mediaWatchingQuery($target),
        refetchInterval: WATCHING_NOW_POLL_INTERVAL,
      })),
    ),
  ).pipe(
    map(($query) => $query.data ?? []),
    distinctUntilChanged(),
  );

  const following = useQuery(followingQuery({ slug: 'me' })).pipe(
    map(($query) => $query.data ?? []),
    distinctUntilChanged(),
  );

  const followed = combineLatest([watchers, following]).pipe(
    map(([$watchers, $following]) => {
      const followedKeys = new Set($following.map((user) => user.key));
      return $watchers.filter((user) => followedKeys.has(user.key));
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  return {
    total: watchers.pipe(map(($watchers) => $watchers.length)),
    followed,
    entries: useWatchingFanOut({
      users: followed.pipe(map(($followed) => $followed.slice(0, FOLLOWED_LIMIT))),
      limit: FOLLOWED_LIMIT,
    }),
  };
}
