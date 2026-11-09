import type { ExtendedMediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { useIsWatched } from '$lib/sections/media-actions/mark-as-watched/useIsWatched.ts';
import { useHasWatchedShowEpisodes } from '$lib/sections/media-actions/rewatching/useHasWatchedShowEpisodes.ts';
import { combineLatest, map } from 'rxjs';

export type IsRateableProps = ExtendedMediaStoreProps;

export function useIsRateable(props: IsRateableProps) {
  if (props.type === 'show') {
    return {
      isRateable: useHasWatchedShowEpisodes(props).hasWatchedShowEpisodes,
    };
  }

  if (props.type === 'season') {
    const { isWatched, isPartiallyWatched } = useIsWatched(props);

    return {
      isRateable: combineLatest([isWatched, isPartiallyWatched]).pipe(
        map(
          ([$isWatched, $isPartiallyWatched]) =>
            $isWatched || $isPartiallyWatched,
        ),
      ),
    };
  }

  return { isRateable: useIsWatched(props).isWatched };
}
