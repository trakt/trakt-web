import { GlobalEventBus } from '../events/GlobalEventBus.ts';

export function trackElementBottom(
  node: HTMLElement,
  cssVarName: string = '--element-bottom',
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

  return {
    destroy() {
      unregisterScroll();
      document.documentElement.style.removeProperty(cssVarName);
    },
  };
}
