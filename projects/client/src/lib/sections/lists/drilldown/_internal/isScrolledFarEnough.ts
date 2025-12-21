export const LOAD_MORE_AT_SCROLL_PERCENTAGE = 0.5;

function calculatePageScrollPercentage() {
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = globalThis.window.innerHeight;
  return globalThis.window.scrollY / (documentHeight - windowHeight);
}

function calculateContainerScrollPercentage(element: HTMLElement) {
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;
  return element.scrollTop / (scrollHeight - clientHeight);
}

export function isScrolledFarEnough(container?: HTMLElement | Nil) {
  const scrollPercentage = container
    ? calculateContainerScrollPercentage(container)
    : calculatePageScrollPercentage();

  return scrollPercentage > LOAD_MORE_AT_SCROLL_PERCENTAGE;
}
