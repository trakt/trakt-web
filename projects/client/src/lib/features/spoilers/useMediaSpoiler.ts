import {
  type IsWatchedProps,
  useIsWatched,
} from '$lib/sections/media-actions/mark-as-watched/useIsWatched';
import { derived } from 'svelte/store';
import { useSpoiler } from './_internal/useSpoiler';

export function useMediaSpoiler(props: IsWatchedProps) {
  const { isWatched } = useIsWatched(props);
  const { isSpoilerHidden: isHidden } = useSpoiler();

  const isSpoilerHidden = derived(
    [isWatched, isHidden],
    ([$isWatched, $isHidden]) => {
      return !$isWatched && $isHidden;
    },
  );

  return { isSpoilerHidden };
}
