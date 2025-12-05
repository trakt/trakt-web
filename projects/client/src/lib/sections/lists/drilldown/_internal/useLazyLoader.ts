import { browser } from '$app/environment';
import { useDimensionObserver } from '$lib/stores/css/useDimensionObserver.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { debounce } from '$lib/utils/timing/debounce.ts';
import { time } from '$lib/utils/timing/time.ts';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { assertDefined } from '../../../../utils/assert/assertDefined.ts';
import { NOOP_FN } from '../../../../utils/constants.ts';
import { isPageFilling } from './isPageFilling.ts';
import { isScrolledFarEnough } from './isScrolledFarEnough.ts';

type UseLazyLoaderProps = {
  loadMore: () => void;
  target: 'default' | 'parent';
};

function documentLazyLoader(node: HTMLElement, loadMore: () => void) {
  const { observedDimension, observeDimension } = useDimensionObserver(
    'height',
  );

  function loadMoreOnScroll(element?: HTMLElement | null) {
    if (!isScrolledFarEnough(element)) {
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
    observeDimension(node);

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
      unSubscribeObservedDimension();
      unregisterScroll();
      unregisterResize();
    };
  });
}

// TODO clean up & reduce duplication
function elementLazyLoader(node: HTMLElement, loadMore: () => void) {
  function loadMoreOnScroll(element: HTMLElement | null) {
    if (!isScrolledFarEnough(element)) {
      return;
    }

    loadMore();
  }

  onMount(() => {
    const parent = assertDefined(
      node.parentElement,
      'Parent element is required',
    );

    const debouncedLoadOnScroll = debounce(
      () => loadMoreOnScroll(parent),
      time.fps(10),
    );

    parent.addEventListener('scroll', () => debouncedLoadOnScroll());

    return () => {
      parent.removeEventListener('scroll', () => debouncedLoadOnScroll());
    };
  });
}

export function useLazyLoader({ loadMore, target }: UseLazyLoaderProps) {
  if (!browser) {
    return {
      lazyLoader: NOOP_FN,
    };
  }

  const lazyLoader = (node: HTMLElement) => {
    target === 'default'
      ? documentLazyLoader(node, loadMore)
      : elementLazyLoader(node, loadMore);
  };

  return {
    lazyLoader,
  };
}
