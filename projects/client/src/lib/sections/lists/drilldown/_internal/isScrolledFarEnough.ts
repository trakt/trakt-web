export const LOAD_MORE_AT_SCROLL_PERCENTAGE = 0.5;

function calculatePageScrollPercentage() {
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = globalThis.window.innerHeight;
  return globalThis.window.scrollY / (documentHeight - windowHeight);
}

export function isScrolledFarEnough() {
  const scrollPercentage = calculatePageScrollPercentage();
  return scrollPercentage > LOAD_MORE_AT_SCROLL_PERCENTAGE;
}
