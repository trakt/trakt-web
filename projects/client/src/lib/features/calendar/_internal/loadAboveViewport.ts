import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';

const UPWARD_KEYS = new Set(['ArrowUp', 'PageUp', 'Home']);

type LoadAboveViewportParams = {
  firstKey: string | undefined;
  lastKey: string | undefined;
  canLoad: boolean;
  isArmed: boolean;
  onLoad?: () => boolean;
};

export function loadAboveViewport(
  node: HTMLElement,
  initial: LoadAboveViewportParams,
) {
  let params = initial;
  let height = node.offsetHeight;
  let isArmed = initial.isArmed;
  let isWaiting = false;
  let lastScrollY = globalThis.window.scrollY;

  const isNearTop = () =>
    globalThis.window.scrollY < globalThis.window.innerHeight;

  function loadIfNeeded() {
    if (!isArmed || isWaiting || !params.canLoad || !params.onLoad) return;
    if (!isNearTop()) return;

    isWaiting = params.onLoad();
  }

  function arm() {
    isArmed = true;
    loadIfNeeded();
  }

  function handleScroll() {
    const scrollY = globalThis.window.scrollY;
    const isScrollingUp = scrollY < lastScrollY;
    lastScrollY = scrollY;

    if (isScrollingUp) arm();
    else loadIfNeeded();
  }

  function handleWheel(event: WheelEvent) {
    if (event.deltaY < 0) arm();
  }

  let touchY: number | null = null;

  function handleTouchStart(event: TouchEvent) {
    touchY = event.touches.item(0)?.clientY ?? null;
  }

  function handleTouchMove(event: TouchEvent) {
    const y = event.touches.item(0)?.clientY;
    if (touchY === null || y === undefined || y <= touchY) return;
    arm();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (UPWARD_KEYS.has(event.key)) arm();
  }

  const bus = GlobalEventBus.getInstance();
  const unregisters = [
    bus.register('scroll', handleScroll),
    bus.register('wheel', handleWheel),
    bus.register('touchstart', handleTouchStart),
    bus.register('touchmove', handleTouchMove),
    bus.register('keydown', handleKeyDown),
  ];

  loadIfNeeded();

  return {
    update(next: LoadAboveViewportParams) {
      const nextHeight = node.offsetHeight;
      const isPrepend =
        params.firstKey !== undefined &&
        next.firstKey !== params.firstKey &&
        next.lastKey === params.lastKey;

      if (isPrepend && nextHeight > height) {
        globalThis.window.scrollBy(0, nextHeight - height);
        lastScrollY = globalThis.window.scrollY;
      }

      isWaiting = false;
      isArmed = isArmed || next.isArmed;
      params = next;
      height = nextHeight;
      loadIfNeeded();
    },
    destroy() {
      unregisters.forEach((unregister) => unregister());
    },
  };
}
