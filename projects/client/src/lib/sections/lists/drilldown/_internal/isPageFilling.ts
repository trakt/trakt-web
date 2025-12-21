export function isPageFilling(height: number, container?: HTMLElement | Nil) {
  const availableHeight = container
    ? container.clientHeight
    : globalThis.window.innerHeight + globalThis.window.scrollY;

  return height > availableHeight;
}
