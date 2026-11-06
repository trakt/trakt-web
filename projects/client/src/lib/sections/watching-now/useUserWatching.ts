import { useQuery } from '$lib/features/query/useQuery.ts';
import { userWatchingQuery } from '$lib/requests/queries/users/userWatchingQuery.ts';
import { combineLatest, distinctUntilChanged, map, type Observable } from 'rxjs';
import { useWatchingClock } from './_internal/useWatchingClock.ts';
import { WATCHING_NOW_POLL_INTERVAL } from './_internal/WATCHING_NOW_POLL_INTERVAL.ts';

export function useUserWatching(slug: Observable<string>) {
  const query = useQuery(
    slug.pipe(
      map(($slug) => ({
        ...userWatchingQuery({ slug: $slug }),
        retry: 0,
        refetchInterval: WATCHING_NOW_POLL_INTERVAL,
      })),
    ),
  );

  return {
    nowPlaying: combineLatest([query, useWatchingClock()]).pipe(
      map(([$query, now]) => {
        const nowPlaying = $query.data ?? null;
        if (!nowPlaying) return null;
        if (nowPlaying.expiresAt.getTime() <= now) return null;

        return nowPlaying;
      }),
      distinctUntilChanged(),
    ),
  };
}
