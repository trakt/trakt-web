import type { ExtendedMediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { useIsWatched } from '$lib/sections/media-actions/mark-as-watched/useIsWatched.ts';
import { useHasWatchedShowEpisodes } from '$lib/sections/media-actions/rewatching/useHasWatchedShowEpisodes.ts';

export type IsRateableProps = ExtendedMediaStoreProps;

export function useIsRateable(props: IsRateableProps) {
  if (props.type === 'show') {
    return {
      isRateable: useHasWatchedShowEpisodes(props).hasWatchedShowEpisodes,
    };
  }

  return { isRateable: useIsWatched(props).isWatched };
}
