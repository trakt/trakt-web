import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { onMount } from 'svelte';

export function useScrollDistance() {
  const distanceFromBottom = new BehaviorSubject(0);

  let frame = 0;

  const measure = () => {
    frame = 0;
    const { scrollTop, scrollHeight, clientHeight } =
      globalThis.document.documentElement;

    distanceFromBottom.next(scrollHeight - clientHeight - scrollTop);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(measure);
  };

  onMount(() => {
    schedule();

    const unregisterScroll = GlobalEventBus.getInstance().register(
      'scroll',
      schedule,
    );
    const unregisterResize = GlobalEventBus.getInstance().register(
      'resize',
      schedule,
    );

    return () => {
      cancelAnimationFrame(frame);
      unregisterScroll();
      unregisterResize();
    };
  });

  return {
    distanceFromBottom: distanceFromBottom.pipe(distinctUntilChanged()),
  };
}
