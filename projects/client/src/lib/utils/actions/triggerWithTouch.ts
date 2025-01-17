import { NOOP_FN } from '../constants';

/**
 * This function is needed to handle touch events on iOS devices.
 * On iOS, touch events do not trigger click events by immediately in certain scenarios.
 * This utility ensures that a click event is triggered when a touch event ends,
 * providing a consistent user experience across different devices.
 */
export function triggerWithTouch(
  node: HTMLElement,
  enabled = true,
) {
  // TODO(@seferturan): investigate why we need to disable for search items
  // relates to https://github.com/trakt/trakt-lite/issues/291
  if (!enabled) {
    return {
      destroy: NOOP_FN,
    };
  }

  const handleTouchEnd = (event: PointerEvent) => {
    // TODO: improvement, ideally we apply this only for iOS devices
    // iPad and iPhone to be more specific, investigate how to consistently detect them
    const isMouse = event.pointerType === 'mouse';

    if (isMouse) {
      return;
    }

    const isElement = event.target instanceof HTMLElement;
    if (!isElement) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.target.click();
  };

  node.addEventListener('pointerup', handleTouchEnd);

  return {
    destroy() {
      node.removeEventListener('pointerup', handleTouchEnd);
    },
  };
}
