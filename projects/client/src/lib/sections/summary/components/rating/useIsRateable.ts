import type { ExtendedMediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { useIsWatched } from '$lib/sections/media-actions/mark-as-watched/useIsWatched.ts';
import { useHasWatchedShowEpisodes } from '$lib/sections/media-actions/rewatching/useHasWatchedShowEpisodes.ts';

export type IsRateableProps = ExtendedMediaStoreProps;

/**
 * Whether this viewer may rate the title yet: rating is an opinion about
 * something watched, so an unseen title offers no stars.
 *
 * Lives beside RateNow rather than under its `_internal/` because four
 * surfaces outside this folder ask the question - the summary headers, the
 * episode drawer and the rating mark.
 */
export function useIsRateable(props: IsRateableProps) {
  if (props.type === 'show') {
    return {
      isRateable: useHasWatchedShowEpisodes(props).hasWatchedShowEpisodes,
    };
  }

  return { isRateable: useIsWatched(props).isWatched };
}
