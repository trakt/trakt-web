import { useQuery } from '$lib/features/query/useQuery.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { userWatchingQuery } from '$lib/requests/queries/users/userWatchingQuery.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
  shareReplay,
} from 'rxjs';
import { toWatchingNowEntries } from './toWatchingNowEntries.ts';
import { WATCHING_NOW_POLL_INTERVAL } from './WATCHING_NOW_POLL_INTERVAL.ts';

type WatchingFanOutParams = {
  users: Observable<ReadonlyArray<UserProfile>>;
  limit: number;
};

function useWatchingSlot(
  users: Observable<ReadonlyArray<UserProfile>>,
  index: number,
) {
  const slug = users.pipe(
    map(($users) => $users.at(index)?.slug ?? null),
    distinctUntilChanged(),
  );

  return useQuery(
    slug.pipe(
      map(($slug) => ({
        ...userWatchingQuery({ slug: $slug ?? '' }),
        enabled: $slug != null,
        retry: 0,
        refetchInterval: WATCHING_NOW_POLL_INTERVAL,
      })),
    ),
  ).pipe(
    map(($query) => $query.data),
    distinctUntilChanged(),
  );
}

export function useWatchingFanOut({ users, limit }: WatchingFanOutParams) {
  const slots = Array.from({ length: limit }, (_, index) =>
    useWatchingSlot(users, index),
  );

  return combineLatest([users, ...slots]).pipe(
    map(([$users, ...$watching]) =>
      toWatchingNowEntries({
        users: $users,
        watching: $watching,
        now: Date.now(),
      }),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
