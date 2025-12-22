import { browser } from '$app/environment';
import { useDimensionObserver } from '$lib/stores/css/useDimensionObserver.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { debounce } from '$lib/utils/timing/debounce.ts';
import { time } from '$lib/utils/timing/time.ts';
import { onMount } from 'svelte';
import { isPageFilling } from './isPageFilling.ts';
import { isScrolledFarEnough } from './isScrolledFarEnough.ts';

type UseLazyLoaderProps = {
  loadMore: () => void;
  parent: HTMLElement | Nil;
};

export function useLazyLoader({ loadMore, parent }: UseLazyLoaderProps) {
  if (!browser) {
    return {
      observeDimension: NOOP_FN,
    };
  }

  const { observedDimension, observeDimension } = useDimensionObserver(
    'height',
  );

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
    const debouncedLoadOnResize = debounce(loadMoreOnResize, time.fps(10));
    const debouncedLoadOnScroll = debounce(loadMoreOnScroll, time.fps(10));

    function registerEvents() {
      const scrollHandler = () => debouncedLoadOnScroll();
      const resizeHandler = () => debouncedLoadOnResize();

      if (parent) {
        parent.addEventListener('scroll', scrollHandler);

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

    const subscription = observedDimension.subscribe(
      (dimension) => {
        if (dimension === 0) {
          return;
        }
        debouncedLoadOnResize();
      },
    );

    const unregister = registerEvents();

    return () => {
      subscription.unsubscribe();
      unregister();
    };
  });

  return {
    observeDimension,
  };
}
