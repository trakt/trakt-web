import { useQuery } from '$lib/features/query/useQuery.ts';
import { followingWatchingQuery } from '$lib/requests/queries/users/followingWatchingQuery.ts';
import { combineLatest, distinctUntilChanged, map, shareReplay } from 'rxjs';
import { hasSameWatchingEntries } from './_internal/hasSameWatchingEntries.ts';
import { toWatchingNowEntries } from './_internal/toWatchingNowEntries.ts';
import { useWatchingClock } from './_internal/useWatchingClock.ts';
import { watchingNowPollInterval } from './_internal/watchingNowPollInterval.ts';

export function useFollowingWatching() {
  const query = useQuery({
    ...followingWatchingQuery({}),
    refetchInterval: watchingNowPollInterval,
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
