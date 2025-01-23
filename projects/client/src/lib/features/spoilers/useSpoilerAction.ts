import { useSpoiler } from './useSpoiler';

export function useSpoilerAction() {
  const { isSpoilerHidden } = useSpoiler();

  function spoiler(node: HTMLElement, isDisabled: boolean) {
    const add = () => {
      if (isDisabled) {
        return;
      }

      node.classList.add('trakt-spoiler');
    };

    const remove = () => {
      node.classList.remove('trakt-spoiler');
    };

    const unsubscribe = isSpoilerHidden
      .subscribe((isHidden) => {
        if (isDisabled) {
          return remove();
        }

        (isHidden ? add : remove)();
      });

    return {
      destroy() {
        unsubscribe();
        node.classList.remove('trakt-spoiler');
      },
      update(isDisabled: boolean) {
        if (isDisabled) {
          return remove();
        }

        add();
      },
    };
  }

  return {
    spoiler,
  };
}
