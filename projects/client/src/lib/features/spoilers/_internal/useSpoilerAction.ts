import { SPOILER_CLASS_NAME } from '$lib/features/spoilers/constants.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { useMediaSpoiler } from '../useMediaSpoiler.ts';

type SpoilerActionProps = MediaStoreProps;

export function useSpoilerAction(rest: SpoilerActionProps) {
  const { isSpoilerHidden } = useMediaSpoiler(rest);

  function spoiler(node: HTMLElement) {
    const add = () => {
      node.classList.add(SPOILER_CLASS_NAME);
    };

    const remove = () => {
      node.classList.remove(SPOILER_CLASS_NAME);
    };

    function applySpoilerStyle(isHidden: boolean) {
      if (!isHidden) {
        return remove();
      }

      (isHidden ? add : remove)();
    }

    const subscription = isSpoilerHidden
      .subscribe((isHidden) => applySpoilerStyle(isHidden));

    return {
      destroy() {
        subscription.unsubscribe();
        node.classList.remove(SPOILER_CLASS_NAME);
      },
    };
  }

  return {
    spoiler,
  };
}
