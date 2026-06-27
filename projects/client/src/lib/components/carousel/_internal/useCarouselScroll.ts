import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { scrollSign } from './scrollSign.ts';

type ScrollState = {
  readonly scrollLeft: number;
  readonly scrollWidth: number;
  readonly clientWidth: number;
};

const INITIAL_SCROLL_STATE: ScrollState = {
  scrollLeft: 0,
  scrollWidth: 0,
  clientWidth: 0,
};

// RTL browsers report scrollLeft as <= 0 (0 at the inline start, growing
// negative toward the end). Normalizing on the absolute value keeps the
// scroll-affordance math direction-agnostic.
const distanceFromStart = ({ scrollLeft }: ScrollState) => Math.abs(scrollLeft);
const distanceFromEnd = (
  { scrollLeft, scrollWidth, clientWidth }: ScrollState,
) => scrollWidth - clientWidth - Math.abs(scrollLeft);

export function useCarouselScroll() {
  const scrollState$ = new BehaviorSubject<ScrollState>(INITIAL_SCROLL_STATE);

  const canScrollToStart = scrollState$.pipe(
    map((state) => distanceFromStart(state) > 0),
    distinctUntilChanged(),
  );

  const canScrollToEnd = scrollState$.pipe(
    map((state) => distanceFromEnd(state) > 1),
    distinctUntilChanged(),
  );

  let listElement: HTMLUListElement | null = null;

  const scroll = (target: 'start' | 'end') => {
    if (!listElement) return;
    const sign = scrollSign({
      target,
      isRtl: getComputedStyle(listElement).direction === 'rtl',
    });
    listElement.scrollBy({
      left: sign * listElement.clientWidth,
      behavior: 'smooth',
    });
  };

  const scrollObserver = (node: HTMLUListElement) => {
    listElement = node;

    const emitState = () => {
      scrollState$.next({
        scrollLeft: node.scrollLeft,
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth,
      });
    };

    let frame = 0;
    const scheduleEmit = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        emitState();
      });
    };

    emitState();
    node.addEventListener('scroll', scheduleEmit, { passive: true });

    const resizeObserver = new ResizeObserver(scheduleEmit);
    resizeObserver.observe(node);

    return {
      destroy() {
        if (frame) cancelAnimationFrame(frame);
        node.removeEventListener('scroll', scheduleEmit);
        resizeObserver.disconnect();
        scrollState$.complete();
        listElement = null;
      },
    };
  };

  return {
    canScrollToStart,
    canScrollToEnd,
    scrollObserver,
    scroll,
  };
}
