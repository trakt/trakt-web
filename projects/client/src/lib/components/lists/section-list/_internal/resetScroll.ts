import { tick } from 'svelte';

export function resetScroll(node: HTMLElement, key?: unknown) {
  if (key !== undefined) {
    // Key-based mode: reset only when key changes, not on every DOM mutation.
    // Used by lists with stable item arrays (e.g. UpNextList) so that in-place
    // updates (marking as watched) don't scroll back to position 0.
    return {
      update() {
        tick().then(() => {
          node.scrollLeft = 0;
        });
      },
      destroy() {},
    };
  }

  const observer = new MutationObserver(() => {
    tick().then(() => {
      node.scrollLeft = 0;
    });
  });

  observer.observe(node, { childList: true });

  return {
    update() {},
    destroy() {
      observer.disconnect();
    },
  };
}
