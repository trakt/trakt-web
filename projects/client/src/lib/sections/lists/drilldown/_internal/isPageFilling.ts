export function isPageFilling(height: number) {
  const availableHeight = globalThis.window.innerHeight +
    globalThis.window.scrollY;

  return height > availableHeight;
}
