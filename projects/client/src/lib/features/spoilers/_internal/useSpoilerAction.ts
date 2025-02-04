import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { useMediaSpoiler } from '../useMediaSpoiler.ts';

type SpoilerActionProps = MediaStoreProps;

export function useSpoilerAction(rest: SpoilerActionProps) {
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
