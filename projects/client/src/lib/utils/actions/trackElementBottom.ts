import { GlobalEventBus } from '../events/GlobalEventBus.ts';

export function trackElementBottom(
  node: HTMLElement,
  cssVarName: string,
) {
  function update() {
    const bottom = node.getBoundingClientRect().bottom;
    document.documentElement.style.setProperty(cssVarName, `${bottom}px`);
  }

  update();

  const unregisterScroll = GlobalEventBus.getInstance().register(
    'scroll',
    update,
  );
  const resizeObserver = new ResizeObserver(update);
  resizeObserver.observe(node);

  return {
    destroy() {
      unregisterScroll();
      resizeObserver.disconnect();
      document.documentElement.style.removeProperty(cssVarName);
    },
  };
}
