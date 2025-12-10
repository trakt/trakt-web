import { browser } from '$app/environment';
import { useDimensionObserver } from '$lib/stores/css/useDimensionObserver.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { debounce } from '$lib/utils/timing/debounce.ts';
import { time } from '$lib/utils/timing/time.ts';
import { firstValueFrom } from 'rxjs';
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

  async function loadMoreOnResize() {
    const height = await firstValueFrom(observedDimension);
    if (isPageFilling(height)) {
      return;
    }

    loadMore();
  }

  onMount(() => {
    const debouncedLoadOnResize = debounce(loadMoreOnResize, time.fps(10));
    const debouncedLoadOnScroll = debounce(loadMoreOnScroll, time.fps(10));

    const unSubscribeObservedDimension = observedDimension.subscribe(
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
      unSubscribeObservedDimension.unsubscribe();
      unregisterScroll();
      unregisterResize();
    };
  });

  return {
    observeDimension,
  };
}
