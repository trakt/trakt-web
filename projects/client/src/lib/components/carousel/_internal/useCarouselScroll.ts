import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

type Direction = 'left' | 'right';

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

export function useCarouselScroll() {
  const scrollState$ = new BehaviorSubject<ScrollState>(INITIAL_SCROLL_STATE);

  const canScrollLeft = scrollState$.pipe(
    map(({ scrollLeft }) => scrollLeft > 0),
    distinctUntilChanged(),
  );

  const canScrollRight = scrollState$.pipe(
    map(({ scrollLeft, scrollWidth, clientWidth }) =>
      scrollLeft < scrollWidth - clientWidth - 1
    ),
    distinctUntilChanged(),
  );

  let listElement: HTMLUListElement | null = null;

  const scroll = (direction: Direction) => {
    if (!listElement) return;
    const amount = listElement.clientWidth;
    listElement.scrollBy({
      left: direction === 'left' ? -amount : amount,
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
    canScrollLeft,
    canScrollRight,
    scrollObserver,
    scroll,
  };
}
