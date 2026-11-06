import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaSocialQueryTarget } from '$lib/requests/queries/media/mediaSocialQuery.ts';
import { mediaWatchingQuery } from '$lib/requests/queries/media/mediaWatchingQuery.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
  shareReplay,
} from 'rxjs';
import { hasSameWatchingEntries } from './_internal/hasSameWatchingEntries.ts';
import { isWatchingTarget } from './_internal/isWatchingTarget.ts';
import { watchingNowPollInterval } from './_internal/watchingNowPollInterval.ts';
import { useFollowingWatching } from './useFollowingWatching.ts';

export function useMediaWatching(target: Observable<MediaSocialQueryTarget>) {
  const watcherCount = useQuery(
    target.pipe(
      map(($target) => ({
        ...mediaWatchingQuery($target),
        refetchInterval: watchingNowPollInterval,
      })),
    ),
  ).pipe(map(($query) => $query.data?.length ?? 0));

  const entries = combineLatest([
    target,
    useFollowingWatching().entries,
  ]).pipe(
    map(([$target, $entries]) =>
      $entries.filter((entry) =>
        isWatchingTarget({ nowPlaying: entry.nowPlaying, target: $target }),
      ),
    ),
    distinctUntilChanged(hasSameWatchingEntries),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  return {
    total: combineLatest([watcherCount, entries]).pipe(
      map(([$count, $entries]) => Math.max($count, $entries.length)),
      distinctUntilChanged(),
    ),
    followed: entries.pipe(
      map(($entries) => $entries.map((entry) => entry.user)),
    ),
    entries,
  };
}
