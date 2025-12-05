export const LOAD_MORE_AT_SCROLL_PERCENTAGE = 0.5;

function calculatePageScrollPercentage() {
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = globalThis.window.innerHeight;
  return globalThis.window.scrollY / (documentHeight - windowHeight);
}

function calculateElementScrollPercentage(element: HTMLElement) {
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;
  return element.scrollTop / (scrollHeight - clientHeight);
}

export function isScrolledFarEnough(element?: HTMLElement | null) {
  const scrollPercentage = element
    ? calculateElementScrollPercentage(element)
    : calculatePageScrollPercentage();

  return scrollPercentage > LOAD_MORE_AT_SCROLL_PERCENTAGE;
}
