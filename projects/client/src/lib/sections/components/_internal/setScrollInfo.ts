import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { onMount } from 'svelte';

const SUB_PIXEL_OFFSET = 0.6666666666666666;

export function setScrollInfo(node: HTMLElement) {
  const scrollHandler = () => {
    const { scrollTop, scrollHeight, clientHeight } = node;
    const hasOverflow = scrollHeight > clientHeight;
    if (!hasOverflow) {
      return;
    }

    const isAtTop = scrollTop === 0;
    const scrollDifference = scrollHeight - scrollTop - clientHeight;
    const isAtBottom = scrollDifference <= SUB_PIXEL_OFFSET;

    node.classList.toggle('scrolled-down', !isAtTop);
    node.classList.toggle('scrolled-up', !isAtBottom);
  };

  let frame = 0;
  const scheduleScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      scrollHandler();
    });
  };

  node.addEventListener('scroll', scheduleScroll, { passive: true });
  const unregisterResize = GlobalEventBus.getInstance().register(
    'resize',
    scheduleScroll,
  );

  onMount(scrollHandler);

  return {
    destroy() {
      if (frame) cancelAnimationFrame(frame);
      unregisterResize();
      node.removeEventListener('scroll', scheduleScroll);
    },
  };
}
