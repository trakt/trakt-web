import type { IsWatchedProps } from '$lib/sections/media-actions/mark-as-watched/useIsWatched';
import { useMediaSpoiler } from '../useMediaSpoiler';

export function useSpoilerAction(rest: IsWatchedProps) {
  const { isSpoilerHidden } = useMediaSpoiler(rest);

  function spoiler(node: HTMLElement) {
    const add = () => {
      node.classList.add('trakt-spoiler');
    };

    const remove = () => {
      node.classList.remove('trakt-spoiler');
    };

    function applySpoilerStyle(isHidden: boolean) {
      if (!isHidden) {
        return remove();
      }

      (isHidden ? add : remove)();
    }

    const unsubscribe = isSpoilerHidden
      .subscribe((isHidden) => applySpoilerStyle(isHidden));

    return {
      destroy() {
        unsubscribe();
        node.classList.remove('trakt-spoiler');
      },
    };
  }

  return {
    spoiler,
  };
}
