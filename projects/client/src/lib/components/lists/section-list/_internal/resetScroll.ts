import { tick } from 'svelte';

export function resetScroll(node: HTMLElement) {
  const observer = new MutationObserver(() => {
    tick().then(() => {
      node.scrollLeft = 0;
    });
  });

  observer.observe(node, { childList: true });

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
