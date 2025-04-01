import { derived, writable } from 'svelte/store';

export const useWidthObserver = () => {
  const observedWidth = writable(0);

  const observeWidth = (node: HTMLElement) => {
    const observer = new MutationObserver(() => {
      const { width: newWidth } = node.getBoundingClientRect();
      observedWidth.set(newWidth);
    });

    observer.observe(node, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return {
      destroy() {
        observer.disconnect();
      },
    };
  };

  return {
    observedWidth: derived(observedWidth, ($observedWidth) => $observedWidth),
    observeWidth,
  };
};
