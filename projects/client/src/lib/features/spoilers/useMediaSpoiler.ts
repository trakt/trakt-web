import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import {
  useIsWatched,
} from '$lib/sections/media-actions/mark-as-watched/useIsWatched.ts';
import { combineLatest, map } from 'rxjs';
import { useSpoiler } from './_internal/useSpoiler.ts';

export type MediaSpoilerProps = MediaStoreProps;

export function useMediaSpoiler(props: MediaSpoilerProps) {
  const { isWatched } = useIsWatched(props);
  const { isSpoilerHidden: isHidden } = useSpoiler();

  const isSpoilerHidden = combineLatest(
    [isWatched, isHidden],
  ).pipe(
    map(([$isWatched, $isHidden]) => {
      return !$isWatched && $isHidden;
    }),
  );

  return { isSpoilerHidden };
}
