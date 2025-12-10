import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { BehaviorSubject } from 'rxjs';
import { onMount } from 'svelte';

export function useScrollDistance() {
  const distanceFromBottom = new BehaviorSubject(0);

  const handleScroll = () => {
    const scrollTop = globalThis.document.documentElement.scrollTop;
    const scrollHeight = globalThis.document.documentElement.scrollHeight;
    const clientHeight = globalThis.document.documentElement.clientHeight;

    const scrollDistance = scrollHeight - clientHeight;
    distanceFromBottom.next(scrollDistance - scrollTop);
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
    distanceFromBottom: distanceFromBottom.asObservable(),
  };
}
