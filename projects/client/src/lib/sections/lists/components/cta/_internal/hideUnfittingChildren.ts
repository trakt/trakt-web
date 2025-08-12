import { debounce } from '$lib/utils/timing/debounce.ts';
import { time } from '$lib/utils/timing/time.ts';
import { onMount } from 'svelte';

export function hideUnfittingChildren(node: HTMLElement) {
  const children = Array.from(node.children) as HTMLElement[];

  const setChildrenVisibility = () => {
    const right = node.getBoundingClientRect().right;

    children.forEach((child) => {
      const childRight = child.getBoundingClientRect().right;

      const isVisible = childRight <= right;
      isVisible ? child.style.opacity = '1' : child.style.opacity = '0';
    });
  };

  const resizeObserver = new ResizeObserver(
    () => debounce(setChildrenVisibility, time.fps(30))(),
  );
  resizeObserver.observe(node);

  onMount(() => {
    setChildrenVisibility();
  });

  return {
    destroy() {
      resizeObserver.disconnect();
    },
  };
}
