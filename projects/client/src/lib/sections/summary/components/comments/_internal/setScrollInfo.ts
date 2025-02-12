import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { onMount } from 'svelte';

export function setScrollInfo(node: HTMLElement) {
  const scrollHandler = () => {
    const { scrollTop, scrollHeight, clientHeight } = node;
    const hasOverflow = scrollHeight > clientHeight;
    if (!hasOverflow) {
      return;
    }

    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollHeight - scrollTop === clientHeight;

    node.classList.toggle('scrolled-down', !isAtTop);
    node.classList.toggle('scrolled-up', !isAtBottom);
  };

  node.addEventListener('scroll', scrollHandler);
  const unregisterResize = GlobalEventBus.getInstance().register(
    'resize',
    () => requestAnimationFrame(scrollHandler),
  );

  onMount(scrollHandler);

  return {
    destroy() {
      unregisterResize();
      node.removeEventListener('scroll', scrollHandler);
    },
  };
}
