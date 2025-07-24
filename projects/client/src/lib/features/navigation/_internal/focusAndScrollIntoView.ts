import { focusElement } from './focusElement.ts';

export const focusAndScrollIntoView = (
  element?: Element | null,
  behavior?: ScrollBehavior,
) => {
  focusElement(element);

  if (!element) return;

  const rect = element.getBoundingClientRect();
  const viewportHeight = globalThis.window.innerHeight;
  const isPageScrolled = globalThis.window.scrollY > 0;

  const isVisible = rect.top >= 0 && rect.bottom <= viewportHeight;

  const isInBottomTwentyPercent = rect.top > viewportHeight * 0.8;

  const shouldScroll = isPageScrolled || !isVisible || isInBottomTwentyPercent;

  if (shouldScroll) {
    element.scrollIntoView({
      block: 'center',
      inline: 'center',
      behavior: behavior ?? 'instant',
    });
  }
};
