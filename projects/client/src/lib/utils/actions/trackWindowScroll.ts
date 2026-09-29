import { GlobalEventBus } from '../events/GlobalEventBus.ts';

export function trackWindowScroll(node: HTMLElement, className: string) {
  let frame = 0;
  let isScrolled: boolean | null = null;

  function update() {
    frame = 0;
    const next = globalThis.window.scrollY > 0;
    if (next === isScrolled) return;

    isScrolled = next;
    node.classList.toggle(className, next);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  update();

  const unregister = GlobalEventBus.getInstance().register(
    'scroll',
    schedule,
  );

  return {
    destroy() {
      cancelAnimationFrame(frame);
      unregister();
    },
  };
}
