import { DragGesture } from '@use-gesture/vanilla';

const SWIPE_THRESHOLD = 40;
const FIRST_SLIDE = 0;

const GESTURE_OPTIONS = {
  filterTaps: true,
  axis: 'x' as const,
  pointer: { touch: true, mouse: false, keys: false },
};

interface SwipeCarouselCallbacks {
  onSlideProgressChange?: (progress: number) => void;
  onDraggingChange?: (isDragging: boolean) => void;
}

function resolveSlideOnRelease(
  dx: number,
  activeSlide: number,
  lastSlide: number,
): number {
  if (Math.abs(dx) < SWIPE_THRESHOLD) return activeSlide;
  return dx < 0
    ? Math.min(activeSlide + 1, lastSlide)
    : Math.max(activeSlide - 1, FIRST_SLIDE);
}

function clampDragX(
  activeSlide: number,
  lastSlide: number,
  dx: number,
): number {
  if (activeSlide === FIRST_SLIDE) return Math.min(0, dx);
  if (activeSlide === lastSlide) return Math.max(0, dx);
  return dx;
}

function computeSlideProgress(
  activeSlide: number,
  lastSlide: number,
  dx: number,
  width: number,
): number {
  return Math.min(lastSlide, Math.max(FIRST_SLIDE, activeSlide - dx / width));
}

export function useSwipeCarousel(
  slideCount: number,
  callbacks: SwipeCarouselCallbacks = {},
) {
  const lastSlide = slideCount - 1;
  const slideOffsetPercent = 100 / slideCount;

  let activeSlide = $state(FIRST_SLIDE);
  let dragX = $state(0);
  let isDragging = $state(false);
  let slideProgress = $state(FIRST_SLIDE);

  const trackTransform = $derived(
    `translateX(calc(${-activeSlide * slideOffsetPercent}% + ${dragX}px))`,
  );

  function setSlideProgress(value: number) {
    slideProgress = value;
    callbacks.onSlideProgressChange?.(value);
  }

  function setIsDragging(value: boolean) {
    isDragging = value;
    callbacks.onDraggingChange?.(value);
  }

  function goToNext() {
    if (activeSlide >= lastSlide) return;
    activeSlide += 1;
    setSlideProgress(activeSlide);
  }

  function goToPrev() {
    if (activeSlide <= FIRST_SLIDE) return;
    activeSlide -= 1;
    setSlideProgress(activeSlide);
  }

  function createGesture(node: HTMLElement): DragGesture {
    return new DragGesture(
      node,
      (state) => {
        const [dx] = state.movement;

        if (state.last) {
          setIsDragging(false);
          dragX = 0;
          activeSlide = resolveSlideOnRelease(dx, activeSlide, lastSlide);
          setSlideProgress(activeSlide);
          return;
        }

        setIsDragging(true);
        setSlideProgress(
          computeSlideProgress(activeSlide, lastSlide, dx, node.clientWidth),
        );
        dragX = clampDragX(activeSlide, lastSlide, dx);
      },
      GESTURE_OPTIONS,
    );
  }

  function setupSwipe(node: HTMLElement, enabled = true) {
    let gesture: DragGesture | undefined;

    if (enabled) {
      gesture = createGesture(node);
    }

    return {
      update(newEnabled: boolean) {
        if (newEnabled && !gesture) {
          gesture = createGesture(node);
        } else if (!newEnabled && gesture) {
          gesture.destroy();
          gesture = undefined;
        }
      },
      destroy: () => gesture?.destroy(),
    };
  }

  return {
    get activeSlide() {
      return activeSlide;
    },
    get isDragging() {
      return isDragging;
    },
    get slideProgress() {
      return slideProgress;
    },
    get trackTransform() {
      return trackTransform;
    },
    goToNext,
    goToPrev,
    setupSwipe,
  };
}
