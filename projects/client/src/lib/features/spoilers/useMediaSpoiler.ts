import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import {
  useIsWatched,
} from '$lib/sections/media-actions/mark-as-watched/useIsWatched.ts';
import { derived } from 'svelte/store';
import { useSpoiler } from './_internal/useSpoiler.ts';

export type MediaSpoilerProps = MediaStoreProps;

export function useMediaSpoiler(props: MediaSpoilerProps) {
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
