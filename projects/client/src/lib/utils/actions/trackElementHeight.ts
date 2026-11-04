export function trackElementHeight(node: HTMLElement, cssVarName: string) {
  const root = document.documentElement;

  function update() {
    const height = Math.round(node.getBoundingClientRect().height);
    root.style.setProperty(cssVarName, `${height}px`);
  }

  update();

  const resizeObserver = new ResizeObserver(update);
  resizeObserver.observe(node);

  return {
    destroy() {
      resizeObserver.disconnect();
      root.style.removeProperty(cssVarName);
    },
  };
}
