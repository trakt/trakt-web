import { GlobalEventBus } from '../events/GlobalEventBus.ts';

export function trackWindowScroll(node: HTMLElement, className: string) {
  function handleScroll() {
    const isScrolled = globalThis.window.scrollY > 0;
    node.classList.toggle(className, isScrolled);
  }

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
