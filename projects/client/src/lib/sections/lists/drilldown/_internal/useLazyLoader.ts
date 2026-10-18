import { browser } from '$app/environment';
import { useDimensionObserver } from '$lib/stores/css/useDimensionObserver.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { onMount } from 'svelte';
import { isPageFilling } from './isPageFilling.ts';
import { isScrolledFarEnough } from './isScrolledFarEnough.ts';

type UseLazyLoaderProps = {
  loadMore: () => void;
  parent: HTMLElement | Nil;
};

function coalescePerFrame(callback: () => void) {
  let frame = 0;

  return {
    schedule() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        callback();
      });
    },
    cancel() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

export function useLazyLoader({ loadMore, parent }: UseLazyLoaderProps) {
  if (!browser) {
    return {
      observeDimension: NOOP_FN,
    };
  }

  const { observedDimension, observeDimension } =
    useDimensionObserver('height');

  function loadMoreOnScroll() {
    if (!isScrolledFarEnough(parent)) {
      return;
    }

    loadMore();
  }

  function loadMoreOnResize() {
    const height = observedDimension.value;
    if (isPageFilling(height, parent)) {
      return;
    }

    loadMore();
  }

  onMount(() => {
    const loadOnResize = coalescePerFrame(loadMoreOnResize);
    const loadOnScroll = coalescePerFrame(loadMoreOnScroll);

    function registerEvents() {
      const scrollHandler = loadOnScroll.schedule;
      const resizeHandler = loadOnResize.schedule;

      if (parent) {
        parent.addEventListener('scroll', scrollHandler, { passive: true });

        return () => {
          parent.removeEventListener('scroll', scrollHandler);
        };
      }

      const instance = GlobalEventBus.getInstance();
      const unregisterScroll = instance.register('scroll', scrollHandler);
      const unregisterResize = instance.register('resize', resizeHandler);

      return () => {
        unregisterScroll();
        unregisterResize();
      };
    }

    const subscription = observedDimension.subscribe((dimension) => {
      if (dimension === 0) {
        return;
      }
      loadOnResize.schedule();
    });

    const unregister = registerEvents();

    return () => {
      subscription.unsubscribe();
      unregister();
      loadOnResize.cancel();
      loadOnScroll.cancel();
    };
  });

  return {
    observeDimension,
  };
}
