import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { onMount } from 'svelte';
import { derived, writable } from 'svelte/store';

export function useScrollDistance() {
  const distanceFromBottom = writable(0);

  const handleScroll = () => {
    const scrollTop = globalThis.document.documentElement.scrollTop;
    const scrollHeight = globalThis.document.documentElement.scrollHeight;
    const clientHeight = globalThis.document.documentElement.clientHeight;

    const scrollDistance = scrollHeight - clientHeight;
    distanceFromBottom.set(scrollDistance - scrollTop);
  };

  onMount(() => {
    requestAnimationFrame(handleScroll);

    const unregisterScroll = GlobalEventBus.getInstance().register(
      'scroll',
      handleScroll,
    );
    const unregisterResize = GlobalEventBus.getInstance().register(
      'resize',
      handleScroll,
    );

    return () => {
      unregisterScroll();
      unregisterResize();
    };
  });

  return {
    distanceFromBottom: derived(
      distanceFromBottom,
      ($distanceFromBottom) => $distanceFromBottom,
    ),
  };
}
