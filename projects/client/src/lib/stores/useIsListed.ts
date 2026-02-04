import { combineLatest, map } from 'rxjs';
import type { MediaEntry } from '../requests/models/MediaEntry.ts';
import { useIsWatchlisted } from './useIsWatchlisted.ts';
import { useListedOnIds } from './useListedOnIds.ts';

export function useIsListed(media: MediaEntry) {
  const { listedOnIds, isLoading } = useListedOnIds({ media });
  const { isWatchlisted } = useIsWatchlisted({ media, type: media.type });

  return {
    isLoading,
    isListed: combineLatest([listedOnIds, isWatchlisted])
      .pipe(
        map(
          ([$listedOnIds, $isWatchlisted]) =>
            $listedOnIds.length > 0 || $isWatchlisted,
        ),
      ),
  };
}
