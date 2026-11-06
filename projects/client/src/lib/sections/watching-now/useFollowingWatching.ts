import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import { followingActivityQuery } from '$lib/requests/queries/users/followingActivityQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { distinctUntilChanged, map, shareReplay } from 'rxjs';
import { toRecentFollowedUsers } from './_internal/toRecentFollowedUsers.ts';
import { useWatchingFanOut } from './_internal/useWatchingFanOut.ts';

const ACTIVITY_LIMIT = 250;
const ACTIVITY_POLL_INTERVAL = time.minutes(10);
const CANDIDATE_LIMIT = 40;

function hasSameKeys<T extends { key: string }>(
  a: ReadonlyArray<T>,
  b: ReadonlyArray<T>,
) {
  return (
    a.length === b.length && a.every((item, index) => item.key === b.at(index)?.key)
  );
}

export function useFollowingWatching() {
  const activity = useInfiniteQuery({
    ...followingActivityQuery({ limit: ACTIVITY_LIMIT }),
    refetchInterval: ACTIVITY_POLL_INTERVAL,
  });

  const users = activity.pipe(
    map(($query) => $query.data?.pages.at(0)?.entries ?? []),
    distinctUntilChanged(),
    map((activities) =>
      toRecentFollowedUsers({ activities, limit: CANDIDATE_LIMIT }),
    ),
    distinctUntilChanged(hasSameKeys),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  return {
    entries: useWatchingFanOut({ users, limit: CANDIDATE_LIMIT }),
  };
}
