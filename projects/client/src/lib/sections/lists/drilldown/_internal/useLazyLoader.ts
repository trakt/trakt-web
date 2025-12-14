import { browser } from '$app/environment';
import { useDimensionObserver } from '$lib/stores/css/useDimensionObserver.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { debounce } from '$lib/utils/timing/debounce.ts';
import { time } from '$lib/utils/timing/time.ts';
import { onMount } from 'svelte';
import { NOOP_FN } from '../../../../utils/constants.ts';
import { isPageFilling } from './isPageFilling.ts';
import { isScrolledFarEnough } from './isScrolledFarEnough.ts';

type UseLazyLoaderProps = {
  loadMore: () => void;
};

export function useLazyLoader({ loadMore }: UseLazyLoaderProps) {
  if (!browser) {
    return {
      observeDimension: NOOP_FN,
    };
  }

  const { observedDimension, observeDimension } = useDimensionObserver(
    'height',
  );

  function loadMoreOnScroll() {
    if (!isScrolledFarEnough()) {
      return;
    }

    loadMore();
  }

  function loadMoreOnResize() {
    const height = observedDimension.value;
    if (isPageFilling(height)) {
      return;
    }

    loadMore();
  }

  onMount(() => {
    const debouncedLoadOnResize = debounce(loadMoreOnResize, time.fps(10));
    const debouncedLoadOnScroll = debounce(loadMoreOnScroll, time.fps(10));

    const subscription = observedDimension.subscribe(
      (dimension) => {
        if (dimension === 0) {
          return;
        }
        debouncedLoadOnResize();
      },
    );

    const unregisterScroll = GlobalEventBus.getInstance().register(
      'scroll',
      () => debouncedLoadOnScroll(),
    );

    const unregisterResize = GlobalEventBus.getInstance().register(
      'resize',
      () => debouncedLoadOnResize(),
    );

    return () => {
      subscription.unsubscribe();
      unregisterScroll();
      unregisterResize();
    };
  });

  return {
    observeDimension,
  };
}
