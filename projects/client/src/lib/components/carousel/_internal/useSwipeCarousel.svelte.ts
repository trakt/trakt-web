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
  getSlideCount: () => number,
  callbacks: SwipeCarouselCallbacks = {},
) {
  const lastSlide = $derived(Math.max(FIRST_SLIDE, getSlideCount() - 1));
  const slideOffsetPercent = $derived(100 / Math.max(1, getSlideCount()));

  let requestedSlide = $state(FIRST_SLIDE);
  let dragX = $state(0);
  let isDragging = $state(false);
  let slideProgress = $state(FIRST_SLIDE);

  let isRtl = $state(false);
  const inlineSign = $derived(isRtl ? -1 : 1);

  const activeSlide = $derived(Math.min(requestedSlide, lastSlide));

  const trackTransform = $derived(
    `translateX(calc(${
      -inlineSign * activeSlide * slideOffsetPercent
    }% + ${dragX}px))`,
  );

  function setSlideProgress(value: number) {
    slideProgress = value;
    callbacks.onSlideProgressChange?.(value);
  }

  function setIsDragging(value: boolean) {
    isDragging = value;
    callbacks.onDraggingChange?.(value);
  }

  function goTo(slide: number) {
    requestedSlide = slide;
    setSlideProgress(slide);
  }

  function goToNext() {
    if (activeSlide >= lastSlide) return;
    goTo(activeSlide + 1);
  }

  function goToPrev() {
    if (activeSlide <= FIRST_SLIDE) return;
    goTo(activeSlide - 1);
  }

  function createGesture(node: HTMLElement): DragGesture {
    return new DragGesture(
      node,
      (state) => {
        if (state.tap) {
          setIsDragging(false);
          dragX = 0;
          return;
        }

        const [physicalDx] = state.movement;
        const dx = physicalDx * inlineSign;

        if (state.last) {
          setIsDragging(false);
          dragX = 0;
          goTo(resolveSlideOnRelease(dx, activeSlide, lastSlide));
          return;
        }

        setIsDragging(true);
        setSlideProgress(
          computeSlideProgress(activeSlide, lastSlide, dx, node.clientWidth),
        );
        dragX = clampDragX(activeSlide, lastSlide, dx) * inlineSign;
      },
      GESTURE_OPTIONS,
    );
  }

  function setupSwipe(node: HTMLElement, enabled = true) {
    let gesture: DragGesture | undefined;
    isRtl = getComputedStyle(node).direction === 'rtl';

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
    get lastSlide() {
      return lastSlide;
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
