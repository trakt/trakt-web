import { browser } from '$app/environment';
import { useDimensionObserver } from '$lib/stores/css/useDimensionObserver.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { debounce } from '$lib/utils/timing/debounce.ts';
import { time } from '$lib/utils/timing/time.ts';
import { isPageFilling } from './isPageFilling.ts';
import { isScrolledFarEnough } from './isScrolledFarEnough.ts';

type UseLazyLoaderProps = {
  loadMore: () => void;
  target: 'default' | 'parent';
};

export function useLazyLoader({ loadMore, target }: UseLazyLoaderProps) {
  if (!browser) {
    return {
      lazyLoader: NOOP_FN,
    };
  }

  const lazyLoader = (node: HTMLElement) => {
    const parent = target === 'parent' ? node.parentElement : null;

    const { observedDimension, observeDimension } = useDimensionObserver(
      'height',
    );
    observeDimension(node);

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

    return {
      destroy() {
        subscription.unsubscribe();
        unregister();
      },
    };
  };

  return {
    lazyLoader,
  };
}
