import { useQuery } from '$lib/features/query/useQuery.ts';
import { followingWatchingQuery } from '$lib/requests/queries/users/followingWatchingQuery.ts';
import { combineLatest, distinctUntilChanged, map, shareReplay } from 'rxjs';
import { hasSameWatchingEntries } from './_internal/hasSameWatchingEntries.ts';
import { toWatchingNowEntries } from './_internal/toWatchingNowEntries.ts';
import { useWatchingClock } from './_internal/useWatchingClock.ts';
import { WATCHING_NOW_POLL_INTERVAL } from './_internal/WATCHING_NOW_POLL_INTERVAL.ts';

export function useFollowingWatching() {
  const query = useQuery({
    ...followingWatchingQuery({}),
    refetchInterval: WATCHING_NOW_POLL_INTERVAL,
  });

  return {
    entries: combineLatest([query, useWatchingClock()]).pipe(
      map(([$query, now]) => {
        const watching = $query.data ?? [];

        return toWatchingNowEntries({
          users: watching.map((entry) => entry.user),
          watching: watching.map((entry) => entry.nowPlaying),
          now,
        });
      }),
      distinctUntilChanged(hasSameWatchingEntries),
      shareReplay({ bufferSize: 1, refCount: true }),
    ),
  };
}
