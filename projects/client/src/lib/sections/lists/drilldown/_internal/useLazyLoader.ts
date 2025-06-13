import { browser } from '$app/environment';
import { useDimensionObserver } from '$lib/stores/css/useDimensionObserver.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { debounce } from '$lib/utils/timing/debounce.ts';
import { time } from '$lib/utils/timing/time.ts';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
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
    const height = get(observedDimension);
    if (isPageFilling(height)) {
      return;
    }

    loadMore();
  }

  onMount(() => {
    const unSubscribeObservedDimension = observedDimension.subscribe(
      (dimension) => {
        if (dimension === 0) {
          return;
        }
        debounce(loadMoreOnResize, time.fps(10))();
      },
    );

    const unregisterScroll = GlobalEventBus.getInstance().register(
      'scroll',
      () => debounce(loadMoreOnScroll, time.fps(10))(),
    );

    const unregisterResize = GlobalEventBus.getInstance().register(
      'resize',
      () => debounce(loadMoreOnResize, time.fps(10))(),
    );

    return () => {
      unSubscribeObservedDimension();
      unregisterScroll();
      unregisterResize();
    };
  });

  return {
    observeDimension,
  };
}
