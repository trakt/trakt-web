import { GlobalEventBus } from '../events/GlobalEventBus.ts';

// TODO use threshold
const SCROLL_THRESHOLD = 5;

export function trackWindowScrollDirection(
  node: HTMLElement,
  classNames: {
    up: string;
    down: string;
  },
) {
  let lastScrollY = 0;

  function reset() {
    lastScrollY = 0;
    node.classList.remove(classNames.up, classNames.down);
  }

  function handleScroll() {
    const currentScrollY = globalThis.window.scrollY;
    if (currentScrollY === 0) {
      reset();
      return;
    }

    const isScrollingDown = currentScrollY > lastScrollY;
    const isScrollingUp = currentScrollY < lastScrollY;

    node.classList.toggle(classNames.up, isScrollingUp);
    node.classList.toggle(classNames.down, isScrollingDown);
    lastScrollY = currentScrollY;
  }

  lastScrollY = globalThis.window.scrollY;
  handleScroll();

  const unregister = GlobalEventBus.getInstance().register(
    'scroll',
    handleScroll,
  );

  return {
    destroy() {
      unregister();
    },
  };
}
