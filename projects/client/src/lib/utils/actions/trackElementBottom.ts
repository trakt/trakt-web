import { GlobalEventBus } from '../events/GlobalEventBus.ts';

export function trackElementBottom(
  node: HTMLElement,
  cssVarName: string,
) {
  let frame = 0;
  let written: number | null = null;

  function update() {
    frame = 0;
    const bottom = Math.round(node.getBoundingClientRect().bottom);
    if (bottom === written) return;

    written = bottom;
    document.documentElement.style.setProperty(cssVarName, `${bottom}px`);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  update();

  const unregisterScroll = GlobalEventBus.getInstance().register(
    'scroll',
    schedule,
  );
  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    update();
  });
  resizeObserver.observe(node);

  return {
    destroy() {
      cancelAnimationFrame(frame);
      unregisterScroll();
      resizeObserver.disconnect();
      document.documentElement.style.removeProperty(cssVarName);
    },
  };
}
